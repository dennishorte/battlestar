function listRoutes(app) {
  // Check if app is initialized with routes
  if (!app || !app.router) {
    console.log("Express app is not initialized yet or has no routes defined")
    return []
  }

  const routes = []

  // Process middleware stack recursively
  function processStack(stack, basePath = '') {
    stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly
        const methods = Object.keys(middleware.route.methods)
          .filter(method => middleware.route.methods[method])
          .join(', ')

        // Combine base path with route path
        const fullPath = normalizePath(basePath + middleware.route.path)

        routes.push({
          path: fullPath,
          methods: methods
        })
      }
      else if (middleware.name === 'router') {
        // Router middleware
        let routerBasePath = basePath

        if (middleware.regexp) {
          // Extract the router's base path
          const regexpStr = middleware.regexp.toString()
          // Different regex patterns to try for path extraction
          const patterns = [
            /\/\^\\\/([^\\]+)/,  // Common pattern
            /\/\^(\\\/[^\\]+)/   // Alternative pattern
          ]

          for (const pattern of patterns) {
            const pathMatch = regexpStr.match(pattern)
            if (pathMatch) {
              // Extract and clean up the path segment
              let pathSegment = pathMatch[1].replace(/\\\//g, '/')
              if (!pathSegment.startsWith('/')) {
                pathSegment = '/' + pathSegment
              }
              routerBasePath = basePath + pathSegment
              break
            }
          }
        }

        // Process the nested router's stack recursively with the updated base path
        if (middleware.handle && middleware.handle.stack) {
          processStack(middleware.handle.stack, routerBasePath)
        }
      }
      else if (middleware.handle && middleware.handle.stack) {
        // This might be another type of router or nested middleware
        processStack(middleware.handle.stack, basePath)
      }
    })
  }

  // Helper function to normalize paths (remove double slashes, etc.)
  function normalizePath(path) {
    // Replace double slashes with single slash
    return path.replace(/\/+/g, '/')
  }

  // Start processing from the top level
  processStack(app.router.stack)

  return routes
}

export {
  listRoutes,
}
