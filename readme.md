# Three.js Starter
Courtesy of Bruno Simon of https://threejs-journey.xyz/

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
## Setup with Docker
Download [Docker](https://www.docker.com/products/docker-desktop/)

RUN the following command:
``` bash
# Build the container with compatible webpack node version

docker compose -f development-compose.yml up
```

After compilation, the Red ring must be visible.
