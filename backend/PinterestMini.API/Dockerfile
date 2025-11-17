# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything and restore
COPY . .
RUN dotnet restore

# Publish the application
RUN dotnet publish -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Render sets PORT environment variable
ENV ASPNETCORE_URLS=http://0.0.0.0:$PORT

EXPOSE 8080

ENTRYPOINT ["dotnet", "PinterestMini.API.dll"]
