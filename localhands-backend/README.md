# LocalHands Backend

A Spring Boot application that serves as LocalHands' backend, managing business logic and heavy workloads.

## Features

- **User Authentication** - Login, signup, and forgot password with PIN verification
- **User Customisation** - Update or delete account information or public profile features
- **Service Listings** - Create, edit, delete service listings with photo uploads
- **Service Reviews** - Create, edit, view, delete reviews on listings made by users
- **Messaging** - Send messages between users about a specific service

## Tech Stack

- **Java 21** - The chosen programming language
- **Spring Boot 4.0.3** - The backend framework
- **Maven 4.0.0** - Build tool that automatically packages the backend software enabling it to run on a server and provides the ability to use external libraries/dependencies easily
- **MySQL 9.5** - Database to complement the backend

## Getting Started

### Prerequisites

-	**Java Development Kit (21+)** - OpenJDK, Oracle JDK, etc
-	**MySQL** - Any edition (community, enterprise, etc) that results in a local MySQL server running on your computer
-	**IntelliJ IDEA** - This guide utilises this IDE's features, but you can use your preferred one if you want to
-	**Postman** - Recommended software to test the LocalHands API (optional)

Please ensure that you have your local MySQL database running and you know the database's local instance hostname, port, username and password.

### Opening the Project

Open IntelliJ IDEA and open a project with the root directory as `localhands-backend`.

### Environment Variables

**To Enable Environment Variables on IntelliJ IDEA:**

- Click on “LocalhandsBackendApplication” at the top and “Edit Configurations…”.
- Click on the “Modify options” dropdown next to “Build and run” and make sure “Environment variables” under “Operating System” is selected.
- Click off the dropdown and input the environment variables below.

**For Local Development:**

```env
CORS_ALLOWED_ORIGIN=http://localhost:3000
DB_PASSWORD={local instance password}
DB_URL=jdbc:mysql://{local instance hostname}:{local instance port}/localhands
DB_USERNAME={local instance username}
EMAIL_SERVICE_FROM_EMAIL={email address to send automated emails}
EMAIL_SERVICE_PASSWORD={email app password}
JWT_KEY={a 32-character sequence of your choice}
```

**For Production:**

```env
CORS_ALLOWED_ORIGIN={chosen URL to the deployed frontend}
DB_PASSWORD={deployed database instance password}
DB_URL=jdbc:mysql://{deployed database instance hostname}:{deployed database instance port}/localhands
DB_USERNAME={deployed database instance username}
EMAIL_SERVICE_FROM_EMAIL={email address to send automated emails}
EMAIL_SERVICE_PASSWORD={email app password}
JWT_KEY={a 32-character sequence of your choice}
S3_BUCKET={name of S3 bucket}
```

**Environment Variable Details:**

- `CORS_ALLOWED_ORIGIN` - The base URL of a system that can access and use the backend's services.
- `DB_PASSWORD` - The password of the database used.
- `DB_URL` - The URL of the database used.
- `DB_USERNAME` - The username of the database used.
- `EMAIL_SERVICE_FROM_EMAIL` - The email address to send automated emails with.
- `EMAIL_SERVICE_PASSWORD` - The app password related to the email address to send automated emails with.
- `JWT_KEY` - A key used to sign and verify JWTs.
- `S3_BUCKET` - The S3 bucket used to store images in production.

**Note:** To enable emailing functionality, a valid Gmail account with an app password must be set up. If these are left unset, the backend will still run, but email features will be disabled.

**Note:** The backend will facilitate local storage of images for local development, but will use AWS' S3 service to store them instead in production.

### Development

**Before you run the backend using IntelliJ IDEA, you need to enable annotation processing:**
- Select the gear icon at the top.
- Press “Settings…”. 
- Please ensure that the “Lombok” plugin is installed.
- Additionally, click “Build, Execution, Deployment” -> “Compiler” -> “Annotation Processors”.
- Make sure that both “Default” and “Annotation profile for localhands-backend” have annotation processing enabled and “Obtain processors from project classpath” selected.

Press the green triangle run button at the top to run the backend. Ensure that it is the LocalhandsBackendApplication that you are running (`localhands-backend/src/main/java/com/localhands/backend`).

Test each API endpoint using [http://localhost:8080](http://localhost:8080). Postman is a recommended tool to do this.

To stop this, you can press the red square button at the top.

### Build and Package

Type in the root directory:

```bash
mvn clean package
```

OR

```bash
mvn clean package -DskipTests
```

This produces a Java Package (.JAR) that can be run anywhere with all dependencies included.

## Brief Project Structure

```
localhands-backend/                         # Root directory for backend project
├── src/main/                               # Directory containing all source code
    ├── java/com/localhands/backend/        # Main backend code structured into subdirectories
        ├── config                          # Backend configurations
        ├── controller                      # Controller layer defining each API endpoint
        ├── dto                             # Data transfer object classes
        ├── entity                          # Classes representing each database entity
        ├── exception                       # Exception handling
        ├── init                            # Classes that execute as soon as the application runs
        ├── mapper                          # Classes that convert contents from one class to another
        ├── repository                      # Repository layer used to interact with the database
        ├── security                        # Security related classes
        ├── service                         # Service layer that executes tasks called by the controller layer
        ├── util                            # Backend utilities
    ├── resources/application.yaml          # Spring Boot application configuration
├── uploads/                                # Directory containing all file uploads for local development
    ├── listing-images/                     # Contains images related to listings
    ├── profile-pictures/                   # Contains profile images for each user
├── pom.xml                                 # Maven build configuration and dependency management
...
```

## Scripts

| Command | Description |
|---------|-------------|
| `mvn clean package` | Build package |
| `mvn clean package -DskipTests` | Build package without tests involved |

## Learn More

- [Apache Maven](https://maven.apache.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [MySQL](https://www.mysql.com/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Postman](https://www.postman.com/)
