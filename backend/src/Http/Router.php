<?php

declare(strict_types=1);

namespace Yenko\Http;

/**
 * Minimal router. Handlers are closures or [ControllerClass::class, 'method'] pairs and receive the Request.
 * Middleware are callables that receive the Request and throw an HttpException to stop the request.
 */
final class Router
{
    /** @var list<array{method:string,pattern:string,handler:callable|array{0:class-string,1:string},middleware:list<callable>}> */
    private array $routes = [];

    private string $groupPrefix = '';

    /** @var list<callable> */
    private array $groupMiddleware = [];

    /** @param list<callable> $middleware */
    public function get(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->add('GET', $path, $handler, $middleware);
    }

    /** @param list<callable> $middleware */
    public function post(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->add('POST', $path, $handler, $middleware);
    }

    /** @param list<callable> $middleware */
    public function put(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->add('PUT', $path, $handler, $middleware);
    }

    /** @param list<callable> $middleware */
    public function delete(string $path, callable|array $handler, array $middleware = []): void
    {
        $this->add('DELETE', $path, $handler, $middleware);
    }

    /**
     * @param list<callable> $middleware Applied to every route defined inside $define
     * @param callable(Router):void $define
     */
    public function group(string $prefix, array $middleware, callable $define): void
    {
        [$previousPrefix, $previousMiddleware] = [$this->groupPrefix, $this->groupMiddleware];

        $this->groupPrefix .= $prefix;
        $this->groupMiddleware = [...$this->groupMiddleware, ...$middleware];
        $define($this);

        [$this->groupPrefix, $this->groupMiddleware] = [$previousPrefix, $previousMiddleware];
    }

    public function dispatch(Request $request): Response
    {
        $method = $request->method === 'HEAD' ? 'GET' : $request->method;
        $allowedMethods = [];

        foreach ($this->routes as $route) {
            if (preg_match($route['pattern'], $request->path, $matches) !== 1) {
                continue;
            }
            if ($route['method'] !== $method) {
                $allowedMethods[] = $route['method'];
                continue;
            }

            $request->params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            foreach ($route['middleware'] as $middleware) {
                $middleware($request);
            }

            return $this->invoke($route['handler'], $request);
        }

        if ($allowedMethods !== []) {
            return Response::error('Method not allowed.', 405)
                ->withHeader('Allow', implode(', ', array_unique($allowedMethods)));
        }

        throw HttpException::notFound("No API route matches {$request->path}.");
    }

    /** @param list<callable> $middleware */
    private function add(string $method, string $path, callable|array $handler, array $middleware): void
    {
        $fullPath = rtrim($this->groupPrefix . $path, '/') ?: '/';
        $regex = preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $fullPath);

        $this->routes[] = [
            'method' => $method,
            'pattern' => '#^' . $regex . '$#',
            'handler' => $handler,
            'middleware' => [...$this->groupMiddleware, ...$middleware],
        ];
    }

    private function invoke(callable|array $handler, Request $request): Response
    {
        if (is_array($handler) && is_string($handler[0])) {
            $handler = [new $handler[0](), $handler[1]];
        }

        return $handler($request);
    }
}
