import os

import firebase_admin.auth
import requests

from ..models.user import User


class UserService:
    def __init__(self, logger):
        """
        Create an instance of UserService
        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def create_user(self, user):
        """
        Create a new user in MongoDB and if necessary in Firebase
        :param user: new user metadata to be added
        :type user: CreateUserDTO
        :raise Exception: if error encountered adding user in Firebase or MongoDB
        """
        try:
            if user.sign_up_method == "PASSWORD":
                firebase_user = firebase_admin.auth.create_user(
                    email=user.email, password=user.password
                )
                auth_id = firebase_user.uid
            elif user.sign_up_method == "GOOGLE":
                if not user.on_firebase:
                    firebase_user = firebase_admin.auth.create_user(uid=user.auth_id)
                auth_id = user.auth_id

            try:
                new_user = User(
                    _id=auth_id,
                    name=user.name,
                    email=user.email,
                    grad_year=user.grad_year,
                    role=user.role,
                ).save()
            except Exception as mongo_error:
                # rollback user creation in Firebase
                try:
                    firebase_admin.auth.delete_user(firebase_user.uid)
                except Exception as firebase_error:
                    reason = getattr(firebase_error, "message", None)
                    error_message = [
                        "Failed to rollback Firebase user creation after user creation failed.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(firebase_error))
                        ),
                        "Orphaned auth_id (Firebase uid) = {auth_id}".format(
                            auth_id=firebase_user.uid
                        ),
                    ]
                    self.logger.error(" ".join(error_message))
                raise mongo_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        return new_user.to_serializable_dict()

    def get_user_by_email(self, email):
        """
        Retrieve user information based on email address
        :param email: Email address of user to search for
        :type email: String
        :raise KeyError: if user with that email address not found
        :raise Exception: if error encountered retrieving user from Firebase/from database
        """
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            user = User.objects(_id=firebase_user.uid).first()
            if not user:
                raise KeyError(f"No user with email={email}")
            return user.to_serializable_dict()
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get user with email={email}. Reason={reason if reason else str(e)}"
            )
            raise e

    def get_user_by_token(self, access_token):
        """
        Retrieve user information based on provided access token
        :param access_token: Access token of user to search for
        :type access_token: String
        :raise KeyError: if user with that token not found/token is invalid
        :raise Exception: if error encountered retrieving user from Firebase/from database
        """
        try:
            uid = self._get_uid_by_token(access_token)
            return self._get_user_by_id(uid)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get user by token. Reason={reason if reason else str(e)}"
            )
            raise e

    # https://github.com/uwblueprint/starter-code-v2/blob/430de47c026e8480b0e24b4cb77f9c29ec19a0bc/backend/python/app/utilities/firebase_rest_client.py
    def login(self, email, password):
        """
        Authenticate user by email and password
        :param email: Email address of user
        :type email: String
        :param password: Password of user
        :type password: String
        :raise Exception: if error encountered when logging user in via Firebase
        """
        headers = {"Content-Type": "application/json"}
        data = {"email": email, "password": password, "returnSecureToken": "true"}

        response = requests.post(
            "{base_url}?key={api_key}".format(
                base_url=os.getenv("FIREBASE_SIGN_IN_URL"),
                api_key=os.getenv("FIREBASE_WEB_API_KEY"),
            ),
            headers=headers,
            data=str(data),
        )

        response_json = response.json()

        if response.status_code != 200:
            error_message = [
                "Failed to sign-in via Firebase REST API, status code =",
                str(response.status_code),
                "error message =",
                response_json["error"]["message"],
            ]
            self.logger.error(" ".join(error_message))

            raise Exception("Failed to sign-in via Firebase REST API")

        return {
            "id_token": response_json["idToken"],
            "refresh_token": response_json["refreshToken"],
        }

    # https://github.com/uwblueprint/starter-code-v2/blob/430de47c026e8480b0e24b4cb77f9c29ec19a0bc/backend/python/app/utilities/firebase_rest_client.py
    def refresh_token(self, refresh_token):
        """
        Return new ID token given refresh token
        :param refresh_token: Valid refresh token for user
        :type refresh_token: String
        :raise Exception: if error encountered when refreshing user token via Firebase
        """
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = "grant_type=refresh_token&refresh_token={refresh_token}".format(
            refresh_token=refresh_token
        )

        response = requests.post(
            "{base_url}?key={api_key}".format(
                base_url=os.getenv("FIREBASE_REFRESH_TOKEN_URL"),
                api_key=os.getenv("FIREBASE_WEB_API_KEY"),
            ),
            headers=headers,
            data=data,
        )

        response_json = response.json()

        if response.status_code != 200:
            error_message = [
                "Failed to refresh token via Firebase REST API, status code =",
                str(response.status_code),
                "error message =",
                response_json["error"]["message"],
            ]
            self.logger.error(" ".join(error_message))

            raise Exception("Failed to refresh token via Firebase REST API")

        return {
            "id_token": response_json["id_token"],
            "refresh_token": response_json["refresh_token"],
        }

    def _get_user_by_id(self, id):
        try:
            user = User.objects(_id=id).first()
            if not user:
                raise KeyError(f"No user with ID")
            return user.to_serializable_dict()
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get user by ID. Reason={reason if reason else str(e)}"
            )
            raise e

    def _get_uid_by_token(self, access_token):
        try:
            decoded_token = firebase_admin.auth.verify_id_token(access_token)
            print(decoded_token, flush=True)
            return decoded_token["uid"]
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get user by ID. Reason={reason if reason else str(e)}"
            )
            raise e
