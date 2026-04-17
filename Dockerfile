# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files first for better caching
COPY ["SolskaKnjiznica.sln", "./"]
COPY ["src/Backend/API/SolskaKnjiznica.API.csproj", "src/Backend/API/"]
COPY ["src/Backend/Core/SolskaKnjiznica.Core.csproj", "src/Backend/Core/"]
COPY ["src/Backend/Infrastructure/SolskaKnjiznica.Infrastructure.csproj", "src/Backend/Infrastructure/"]

# Restore dependencies
RUN dotnet restore

# Copy all files and build
COPY . .
WORKDIR "/src/src/Backend/API"
RUN dotnet build "SolskaKnjiznica.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "SolskaKnjiznica.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render uses the PORT environment variable, so we need to tell ASP.NET Core to listen on it
ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "SolskaKnjiznica.API.dll"]
