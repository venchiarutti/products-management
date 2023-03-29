<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

require __DIR__ . '/vendor/autoload.php';

use Venchiarutti\ProductsManagement\Controller\{
    ProductNew,
    ProductList,
    ProductDelete
};

$routes = [
    ['POST', '/product/new', ProductNew::class],
    ['POST', '/product/delete', ProductDelete::class],
    ['GET', '/product/list', ProductList::class]
];

foreach ($routes as $route) {
    list($method, $uri, $class) = $route;
    if ($_SERVER['REQUEST_METHOD'] === $method && preg_match("#^$uri$#", $_SERVER['REQUEST_URI'])) {
        $controller = new $class();

        if ($method === 'POST') {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            $result = call_user_func([$controller, 'handle'], $data);
        } else {
            $result = call_user_func([$controller, 'handle']);
        }

        header('Content-Type: application/json');
        echo json_encode($result);
        exit();
    }
}
exit();