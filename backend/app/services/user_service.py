import firebase_admin.auth

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
