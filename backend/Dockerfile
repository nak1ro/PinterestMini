# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution file
COPY PinterestMini.sln ./

# Copy project file
COPY PinterestMini.API/*.csproj PinterestMini.API/

# Restore dependencies
RUN dotnet restore PinterestMini.sln

# Copy all backend files
COPY . .

# Publish the web app
RUN dotnet publish PinterestMini.API/PinterestMini.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

# Required by Render – bind to the port given by the platform
ENV ASPNETCORE_URLS=http://0.0.0.0:$PORT

# Expose port (not strictly required but good practice)
EXPOSE 8080

# Run the application
ENTRYPOINT ["dotnet", "PinterestMini.API.dll"]
