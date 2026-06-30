export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  result: {
    token: string;
    user: {
      _id: string;
      username: string;
      email: string;
      fullname: string;
      avatar: string;
      phone: string;
      status: string;
      roleId: { _id: string; name: string };
      createdAt: string;
      updatedAt: string;
    };
  };
}
