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
                    name=user.name,
                    email=user.email,
                    auth_id=auth_id,
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

        user_dict = UserService._user_to_dict_and_remove_auth_id(new_user)
        print(user_dict)
        return user_dict

    @staticmethod
    def _user_to_dict_and_remove_auth_id(user):
        """
        Convert a User document to a serializable dict and remove the
        auth id field
        :param user: the user
        :type user: User
        """
        user_dict = user.to_serializable_dict()
        user_dict.pop("auth_id", None)
        return user_dict
