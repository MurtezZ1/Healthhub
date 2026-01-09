using JWTAuthentication.WebApi.Models;
using ReactApp1.Server;
using ReactApp1.Server.Data.Models;

public interface IUserService
{
    Task<string> RegisterAsync(RegisterViewModel model);
    Task<AuthenticationModel> GetTokenAsync(TokenRequestModel model);
    Task<string> AddRoleAsync(AddRoleModel model);
    Task<AuthenticationModel> RefreshTokenAsync(string refreshToken);
    User GetById(string id);
    bool RevokeToken(string token);
    Task<IEnumerable<User>> GetAllUsersAsync();

    Task<UserManagerResponse> LoginUserAsync(LogInViewModel loginModel);

    //Task<(string accessToken, string refreshToken, DateTime expiration, List<string> roles)> GenerateTokensAsync(User user);

}