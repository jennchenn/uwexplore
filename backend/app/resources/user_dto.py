class CreateUserDTO:
    def __init__(self, **kwargs):
        self.name = kwargs.get("name")
        self.email = kwargs.get("email")
        self.password = kwargs.get("password")
        self.grad_year = kwargs.get("grad_year")
        self.program = kwargs.get("program")
        self.role = kwargs.get("role")
        self.sign_up_method = kwargs.get("sign_up_method", "PASSWORD")
