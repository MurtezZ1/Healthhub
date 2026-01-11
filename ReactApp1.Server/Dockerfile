# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ReactApp1.Server.csproj", "."]
RUN dotnet restore "./ReactApp1.Server.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ReactApp1.Server.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "ReactApp1.Server.csproj" -c Release -o /app/publish

# Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReactApp1.Server.dll"]
