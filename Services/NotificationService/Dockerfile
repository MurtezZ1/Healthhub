# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["NotificationService.csproj", "."]
RUN dotnet restore "./NotificationService.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "NotificationService.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "NotificationService.csproj" -c Release -o /app/publish

# Final Stage
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.dll"]
