var ProtoBuf = require('protobufjs');

// 載入 Product.proto 檔案
ProtoBuf.load('Product.proto', function(err, root) {
    if (err)
        throw err;

    const msgBuffer = "12 08 41 70 70 6c 65 50 65 6e 1a 20 54 68 65 20 63 6f 6d 62 69 6e 61 74 69 6f 6e 20 6f 66 20 41 70 70 6c 65 20 61 6e 64 20 50 65 6e 25 00 00 c8 42"

    // 並取得 Product 資料定義
    var Product = root.lookup('Ecommerce.Product');
    
    // 解開
    var data = Product.decode(msgBuffer);

    console.log(data)
});