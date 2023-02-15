# Kỹ thuật authentication

Authentication là việc xác thực danh tính người dùng. Ví dụ: bạn vào page abc.com/admin để quản trị trang web của bạn thì bạn cần nói cho server biết là ai.

Bản chất của authentication vẫn là

- Tạo ra một dấu hiệu gì để server biết bạn
- Lưu trữ dấu hiệu này ở đâu
- Thực hành kiểm tra dấu hiệu này như thế nào

Thế giới bây giờ có khá nhiều kiểu xác thực authentication khác nhau:

- Basic authentication
- Session based authentication
- Token based authentication
- Oauth 1.0
- Oauth 2.0
- API key

Sau này đi làm, phổ biến nhất là các bạn sẽ làm việc với Token based authentication

## Token based authentication

Token based authentication là cơ chế xác minh danh tính thông qua việc tạo token. Server sẽ tạo ra một chuỗi ký tự được gọi là token để định danh người dùng, Client sẽ lưu token này ở bộ nhớ, mỗi lần gọi request sẽ gửi token này lên để server xác nhận. Server có thể lưu hoặc không lưu token này tùy usercase.

### Luồng hoạt động

1. Thực hiện login ở client (web, app), username và password sẽ được gửi lên server
2. Server sẽ kiểm tra trong database, nếu có tồn tại username và password thì sẽ tạo ra một token gửi về cho client
3. Client sẽ lưu trữ token trong local storage hoặc cookie,...
4. Client sẽ quản lý việc đã đăng nhập hay chưa bằng việc có token trong bộ nhớ thiết bị hay chưa. Nếu không có nghĩa là chưa đăng nhập (hoặc logout)
5. Client muốn truy cập đến những tài nguyên cần xác thực danh tính thì Client sẽ gửi token lên server thông qua HTTP Header Authorization
6. Server nhận được token sẽ tiến hành kiểm tra và giải mã, nếu đúng thì sẽ trả về data, không thì trả về lỗi.

### JWT

JWT hay JSON Web Token là một tiêu chuẩn mở [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) để đảm bảo an toàn thông tin.

Nói một cách khác JWT là một cách để tạo ra token và kiểm tra token có đúng hay không.

Một số đặc điểm của JWT

- Một chuỗi JWT có 3 phần tách nhau bằng dấu chấm: `header.payload.signature`
- **header** chứa thông tin thuật toán mã hóa. Nó được tạo ra bằng thuật toán và dễ dàng giải mã
- **payload** chứa thông tin người dùng và thời gian hết hạn token. Nó cũng được tạo ra bằng thuật toán và dễ dàng giải mã.
- **signature** là chữ ký, phần quan trọng nhất. Cái này không thể giải mã, vì nó là mã hóa 1 chiều. Chỉ có thể kiểm tra nó có đúng hay không bằng cách mã hóa **header**, **payload** kết hợp với một private key (private key thì thường server sẽ lưu trữ). Vậy nên nếu **header** hoặc **payload** thay đổi thì **signature** sẽ thay đổi.

Vậy nên nếu bạn là người code server thì đừng bao giờ lưu thông tin nhạy cảm ở payload JWT

JWT có thể dùng ở hầu hết các ngôn ngữ phổ biến hiện nay, ví dụ nodejs thì cài `jsonwebtoken`

### access token và refresh token

- Access token là token dùng cho authentication. Token này có thời gian hết hạn khá ngắn (30p hoặc 1h)
- Refresh token là token dùng cho việc tạo một access token khi access token hết hạn. Khi access token hết hạn, bạn gửi refresh token lên server để server kiểm tra và trả về cho bạn một access token mới, từ đó bạn có thể tiếp tục phiên làm việc của bạn. Refresh token có thời gian lưu trữ rất lâu, vài chục ngày hoặc vài năm.

### Một số điều thú vị quanh Token based authentication

Khi gửi access token lên server thì thường sẽ gửi thông qua HTTP Header Authorization như dưới đây

```bash
Authorization: Bearer <access token>
```

Tất nhiên bạn cũng có thể gửi thông qua HTTP Header khác tùy bạn, hoặc thậm chí là HTTP body nếu bạn đã thống nhất với phía server. Việc thông qua Header là Authorization đã có từ trước đây và được nhiều nơi sử dụng nên sau này nhiều anh em dev làm vậy cho dễ dàng nhận biết.

Cái chữ `Bearer` trước access token là để phân biệt giữa các Authentication schemes. Có một số Authentication schemes như: Basic, Bearer, Digest,... Tất nhiên là cũng có thể bạn bỏ đi cái `Bearer` này cũng được nếu server bạn không cần nó.

Đấy, tóm lại là phụ thuộc vào ông server setup như thế nào thôi. Nhưng setup như trên là kiểu setup theo đại đa số dev, mà cái gì nhiều người làm thì mình cũng nên làm theo chứ đừng đánh đố nhau làm gì.

### Cách thực hiện Token based authentication trên client

Bước 1: trong interceptors request use can truyen vô header access token

- get token từ đâu đó, trong demo này thì là bên localStorage.getItem("access_token")
- nếu có access token gán vô config.headers.Authorization = `Bearer ${access_token}` và return về config
  lúc này trong header mỗi lần request sẽ có access token trong header, nếu k có thì sẽ reject về lỗi
  Bước 2: Trong interceptor response use nhận vô, nếu thành công thì return về config( có thể là config.data để lọc
  bớt những thứ không cần thiết. Còn nếu bị lỗi thì bắt đầu set lại Refesh token )
- check trạng thái , có các status cần chú ý, trong đấy thì 401 là err về Authorization và tùy theo server trả về lỗi gì để check
  có thể đại loại như 'EXPIRED_ACCESS_TOKEN'
- lúc này có 1 keyword để gọi lại hàm api vừa rồi được request lên là "Instance" và nhớ return nó, nếu không sẽ bị vòng lặp vô hạn
- Gọi lại hàm refreshTOken( chỉ gọi được nếu nó đang trong trạng thái Promise nhé ) và có thể get được access_token bên trong nó
- Tiến hành đẩy nó vô config.headers.Authorization gán với access_token đã lấy được ở trên và return về er.res.config
- Nhưng vậy là chưa đủ, vd như 1 hàm có nhiều api và nếu vậy thì nó sẽ bị mutiple api do là mỗi hàm đều phải set lại với refreshToken,
  để giải quyết vấn đề này thì ta nên khai báo từ constructor thêm this.refreshTokenRequest = null và check nó. Nếu this.refreshTokenRequest tổn tại thì gán chính nó,
  còn không thì bằng refreshToken(). Lưu ý thì do nó trả về promise nên lúc return lại this.refreshTokenRequest ta vẫn có thể then và xử lí nó
- Khi bước trên đã thành công. Sẽ gặp case là cứ resolved do đã tồn tại this.refreshTokenRequest rồi, mà nó lại set cái access_token cũ vô nên bị infinite loop ( vòng lặp vô hạn)
  cách giải quyết ở đây là ta phải set lại giá trị this.refreshTokenRequest null khi mà phiên refresh_token của ta đã hoàn thành lúc gán, sử dụng finally
  <br>

  > Cơ mà nếu hàm xử lí refresh token bị lỗi thì sao nhở ?

  vì nó đang promise xử lí async nên ta có thể xử lí trong catch bằng việc clear nó đi và throw nó đi qua err.response để nó
  không nhảy qua promise relsovel nữa mà nhảy qua promise reject. lúc này trong interceptor ta cần thêm catch trong lúc return this.refreshTokenRequest
