import os

import firebase_admin.auth

from ...models import db
from ...resources.auth_dto import AuthDTO
from ...resources.create_user_dto import CreateUserWithGoogleDTO
from ...resources.token import Token
from ...utilities.firebase_rest_client import FirebaseRestClient
from .utils import handle_exceptions


class AuthService:
    def __init__(self, logger, user_service, email_service=None):
        """
        Create an instance of AuthService
        :param logger: application's logger instance
        :type logger: logger
        :param user_service: an user_service instance
        :type user_service: IUserService
        :param email_service: an email_service instance
        :type email_service: IEmailService
        """
        self.logger = logger
        self.user_service = user_service
        self.email_service = email_service
        self.firebase_rest_client = FirebaseRestClient(logger)

    def generate_token(self, email, password):
        try:
            token = self.firebase_rest_client.sign_in_with_password(email, password)
            user = self.user_service.get_user_by_email(email)
            return AuthDTO(**{**token.__dict__, **user.__dict__})
        except Exception as e:
            self.logger.error(
                "Failed to generate token for user with email {email}".format(
                    email=email
                )
            )
            raise e

    def generate_oauth_token(self, id_token):
        # If user already has a login with this email, just return the token
        try:
            google_user = self.firebase_rest_client.sign_in_with_google(id_token)
            auth_id = google_user["localId"]
            token = Token(google_user["idToken"], google_user["refreshToken"])
            on_firebase = False
            try:
                user = self.user_service.get_user_by_email(
                    google_user["email"]
                )  # If the user already has an email account, let them access that account
                return AuthDTO(**{**token.__dict__, **user.__dict__})
            except KeyError as e:
                pass
            try:
                firebase_admin.auth.get_user(
                    auth_id
                )  # If a person is on firebase but isn't there locally (a check that's mainly useful in a dev environment) so that we don't double create accounts
                on_firebase = True
            except firebase_admin.auth.UserNotFoundError as e:
                self.logger.error("User not found locally, but exists on Firebase")
            user = self.user_service.create_user(
                CreateUserWithGoogleDTO(
                    first_name=google_user["firstName"],
                    last_name=google_user["lastName"],
                    role="User",
                    email=google_user["email"],
                    auth_id=auth_id,
                    on_firebase=on_firebase,
                )
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to generate token for user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        return AuthDTO(**{**token.__dict__, **user.__dict__})

    def revoke_tokens(self, user_id):
        try:
            auth_id = self.user_service.get_auth_id_by_user_id(user_id)
            firebase_admin.auth.revoke_refresh_tokens(auth_id)
        except Exception as e:
            reason = getattr(e, "message", None)
            error_message = [
                "Failed to revoke refresh tokens of user with id {user_id}".format(
                    user_id=user_id
                ),
                "Reason =",
                (reason if reason else str(e)),
            ]
            self.logger.error(" ".join(error_message))
            raise e

    def renew_token(self, refresh_token):
        try:
            return self.firebase_rest_client.refresh_token(refresh_token)
        except Exception as e:
            self.logger.error("Failed to refresh token")
            raise e
