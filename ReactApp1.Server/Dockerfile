# Use the SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["ReactApp1.Server/ReactApp1.Server.csproj", "ReactApp1.Server/"]
RUN dotnet restore "ReactApp1.Server/ReactApp1.Server.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/ReactApp1.Server"
RUN dotnet build "ReactApp1.Server.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ReactApp1.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "ReactApp1.Server.dll"]
