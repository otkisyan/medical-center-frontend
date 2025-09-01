# Stack

- TypeScript
- React, Next.js
- React Bootstrap
- next-intl Internationalization (Ukrainian, English)
- Docker Compose
- K8s Deployment With Helm Charts, ArgoCD
- **CI (GitHub Actions):**
	- **Jobs:**
        - **lint:** Runs code quality checks using ESLint.
        - **build:** After successful linting, the project is built with Next.js across multiple Node.js versions (18.x, 20.x, 22.x). To improve performance, it leverages caching for both npm and Next.js build cache.
        - **push:** After a successful build, a Docker image of the application is created and pushed to Docker Hub.