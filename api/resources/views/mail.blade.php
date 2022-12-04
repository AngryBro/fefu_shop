<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            font-size: 120%;
            color: black;
        }
        .header {
            height: 80px;
            width: fit-content;
            background-color: rgb(61, 125, 167);
            border: 2px solid black;
            box-sizing: border-box;
            color: white;
        }
        .content {
            width: fit-content;
            height: 1000px;
            border: 2px solid black;
            box-sizing: border-box;
            margin-top: -1px;
        }
        .user {
            height: 100%;
            width: 300px;
            background-color: rgb(219, 233, 255);
            border: 1px solid black;
            margin-left: -1px;
            margin-top: -1px;
            float: left;
        }
        .order .item {
            width: 100%;
        }
        .order {
            float: left;
            width: 695px;
            height: 100%;
        }
        .order .item {
            margin-top: 20px;
        }
        /* .order .table {
            margin-left: 32px;
        } */
        .table .left {
            float: left;
            width: fit-content;
            margin-left: 32px;
        }
        .table .right {
            float: left;
            width: fit-content;
            margin-left: 200px;
        }
        .table {
            width: 100%;
            overflow: hidden;
        }
        .order .line {
            width: 100%;
            height: 1px;
            background-color: black;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .user .line {
            margin: 20px;
            margin-left: 0px;
            height: 1px;
            width: auto;
            background-color: black;
        }
        .user .title {
            font-size: 20pt;
        }
        .user .value {
            margin-top: 10px;
        }
        .user .item {
            margin-left: 20px;
            margin-top: 20px;
        }
        .date {
            float: left;
            display: flex;
            width: 300px;
            height: 100%;
            font-size: 20pt;
        }
        .number {
            float: left;
            display: flex;
            width: 695px;
            height: 100%;
            font-size: 40pt;
        }
    </style>
    <title>Document</title>
</head>
<body>
    <div class="header">
        <div class="date"><div style='margin:auto'>{{$date}}</div></div>
        <div class="number"><div style='margin:auto'>№ {{$order_id}}</div></div>
    </div>
    <div class="content">
        <div class="user">
            <div class="item">
                <div class="title">Имя:</div>
                <div class="value">{{$user['name']}}</div>
                <div class="line"></div>
            </div>
            <div class="item">
                <div class="title">Телефон:</div>
                <div class="value">{{$user['phone']}}</div>
                <div class="line"></div>
            </div>
            <div class="item">
                <div class="title">E-mail:</div>
                <div class="value">{{$user['email']}}</div>
                <div class="line"></div>
            </div>
            <div class="item">
                <div class="title">Тип заказа:</div>
                <div class="value">{{$user['type']}}</div>
                <div class="value">{{$user['adress']}}</div>
                <div class="line"></div>
            </div>
            <div class="item">
                <div class="title">Сумма:</div>
                @if ($user['price'] !== $user['price_discount'])
                    <div class="value" style='text-decoration: line-through; font-size:10pt'>{{$user['price']}}</div>
                @endif
                <div class="value">{{$user['price_discount']}}</div>
                <div class="line"></div>
            </div>
            <div class="item">
                <div class="title">Комментарий:</div>
                <div class="value">{{$user['comment']}}</div>
            </div>
        </div>
        <div class="order">
            @foreach ($order as $item)
                <div class="item">
                    <div class="table">
                        <div class="left">
                            <div class="article">Артикул: {{$item['article']}}</div>
                            <div class="name">Название: {{$item['name']}}</div>
                            <div class="size">Размер: {{$item['size']}}</div>
                            <div class="count">Количество: {{$item['count']}}</div>
                        </div>
                        <div class="right">
                            <div class="price">Цена за шт: {{$item['price_discount']}}</div>
                            <div class="priceAll">Цена позиции: {{$item['price_discount']*$item['count']}}</div>
                        </div>
                    </div>
                    <div class="line"></div>
                </div>
            @endforeach
        </div>
    </div>
</body>
</html>