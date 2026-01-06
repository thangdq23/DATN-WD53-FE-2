import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Space, Typography, Divider, Row, Col, Image, QRCode, Spin, message, Descriptions } from 'antd';
import { 
  ArrowLeftOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  MobileOutlined, 
  MailOutlined, 
  CheckCircleFilled,
  DollarOutlined,
  CalendarOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  TagOutlined
} from '@ant-design/icons';
import { getDetailOrder } from '../../../common/services/order.service';
import { formatCurrency } from '../../../common/utils';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getDetailOrder(id);
        if (response && response.data) {
          setOrder(response.data);
        } else {
          throw new Error('Dữ liệu đơn hàng không hợp lệ');
        }
      } catch (err) {
        console.error('Lỗi khi tải đơn hàng:', err);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        message.error('Có lỗi xảy ra khi tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const renderStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: 'orange', text: 'Chờ thanh toán' },
      PAID: { color: 'green', text: 'Đã thanh toán' },
      CANCELLED: { color: 'red', text: 'Đã hủy' },
      EXPIRED: { color: 'gray', text: 'Hết hạn' },
    };

    const statusInfo = statusMap[status] || { color: 'blue', text: status };
    
    return (
      <Tag color={statusInfo.color}>
        {status === 'PAID' && <CheckCircleFilled style={{ marginRight: 5 }} />}
        {statusInfo.text}
      </Tag>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Title level={4}>{error}</Title>
        <Button 
          type="primary" 
          onClick={() => navigate(-1)}
          style={{ marginTop: 16 }}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Title level={4}>Không tìm thấy thông tin đơn hàng</Title>
        <Button 
          type="primary" 
          onClick={() => navigate('/admin/orders')}
          style={{ marginTop: 16 }}
        >
          Về trang danh sách đơn hàng
        </Button>
      </div>
    );
  }

  const {
    movieName,
    moviePoster,
    roomName,
    startTime,
    seats = [],
    totalAmount,
    ticketId,
    codePayment,
    status,
    userInfo = {},
    createdAt,
    paymentMethod
  } = order;

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>Chi tiết đơn hàng</Title>
            {renderStatusTag(status)}
          </Space>
        }
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card 
              title="Thông tin phim" 
              bordered={false}
              style={{ marginBottom: 24 }}
            >
              <div style={{ display: 'flex', gap: 16 }}>
                <Image
                  src={moviePoster}
                  alt={movieName}
                  width={120}
                  height={180}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                  preview={false}
                />
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ marginTop: 0 }}>{movieName}</Title>
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong><EnvironmentOutlined style={{ marginRight: 8 }} />Rạp chiếu:</Text>
                      <Text style={{ marginLeft: 8 }}>{roomName || 'Chưa cập nhật'}</Text>
                    </div>
                    <div>
                      <Text strong><ClockCircleOutlined style={{ marginRight: 8 }} />Suất chiếu:</Text>
                      <Text style={{ marginLeft: 8 }}>
                        {startTime ? dayjs(startTime).format('HH:mm - DD/MM/YYYY') : 'Chưa cập nhật'}
                      </Text>
                    </div>
                    <div>
                      <Text strong><TagOutlined style={{ marginRight: 8 }} />Ghế đã đặt:</Text>
                      <Text style={{ marginLeft: 8 }}>
                        {seats.length > 0 
                          ? seats.map(seat => seat.label || `Ghế ${seat.seatId}`).join(', ')
                          : 'Chưa có thông tin'}
                      </Text>
                    </div>
                  </Space>
                </div>
              </div>
            </Card>

            <Card 
  title="Thông tin thanh toán" 
  bordered={false}
>
  <Descriptions column={1}>
    <Descriptions.Item label="Mã đơn hàng">
      <Text copyable>{ticketId}</Text>
    </Descriptions.Item>
    <Descriptions.Item label="Mã thanh toán">
      <Text copyable>{codePayment || 'N/A'}</Text>
    </Descriptions.Item>
    <Descriptions.Item label="Thời gian đặt vé">
      {dayjs(createdAt).format('HH:mm - DD/MM/YYYY')}
    </Descriptions.Item>
    <Descriptions.Item label="Tổng tiền">
      <Text strong style={{ color: '#1890ff', fontSize: '1.1em' }}>
        {formatCurrency(totalAmount)}
      </Text>
    </Descriptions.Item>
  </Descriptions>
</Card>
          </Col>

          <Col xs={24} lg={8}>
          <Card 
  title="Thông tin khách hàng"
  bordered={false}
  style={{ marginBottom: 24 }}
>
  <Descriptions 
    column={1} 
    bordered
    size="small"
    style={{ marginBottom: 16 }}
  >
    <Descriptions.Item label="Họ và tên" span={3}>
      <Text strong>{order.customerInfo?.userName || 'Khách vãng lai'}</Text>
    </Descriptions.Item>
    <Descriptions.Item label="Số điện thoại">
      <Space>
        <MobileOutlined />
        <Text>{order.customerInfo?.phone || 'Chưa cập nhật'}</Text>
      </Space>
    </Descriptions.Item>
    <Descriptions.Item label="Email">
      <Space>
        <MailOutlined />
        <Text>{order.customerInfo?.email || 'Chưa cập nhật'}</Text>
      </Space>
    </Descriptions.Item>
    <Descriptions.Item label="Mã khách hàng">
      <Space>
        <UserOutlined />
        <Text>{order.userId ? order.userId.toString() : 'Khách vãng lai'}</Text>
      </Space>
    </Descriptions.Item>
  </Descriptions>

  {/* Customer information only - action buttons removed */}
</Card>

<Card 
  title="Mã QR vé xem phim"
  bordered={false}
  style={{ marginBottom: 24 }}
  bodyStyle={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    padding: '24px 0'
  }}
>
  {order?.ticketId ? (
    <div style={{ textAlign: 'center' }} ref={qrCodeRef}>
      <QRCode 
        value={order.ticketId} 
        size={180}
        color="#000"
        bgColor="#ffffff"
        errorLevel="H"
        style={{ marginBottom: 16 }}
      />
      <div style={{ marginTop: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Mã vé: {order.ticketId}
        </Text>
        {order.movieName && (
          <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
            {order.movieName}
          </Text>
        )}
        {order.startTime && (
          <Text type="secondary" style={{ fontSize: 12, marginBottom: 16 }}>
            {dayjs(order.startTime).format('HH:mm - DD/MM/YYYY')}
          </Text>
        )}
      </div>
    </div>
  ) : (
    <div style={{ 
      width: 180, 
      height: 180, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px dashed #d9d9d9',
      borderRadius: 8,
      marginBottom: 16
    }}>
      <Text type="secondary">Không có thông tin vé</Text>
    </div>
  )}

  <Space direction="vertical" style={{ width: '100%' }}>
    {order?.status === 'buyed' && (
      <Button 
        type="primary" 
        icon={<CheckCircleOutlined />}
        style={{ width: '100%' }}
        onClick={() => {
          message.success('Đã xác nhận sử dụng vé thành công');
        }}
      >
        Xác nhận sử dụng vé
      </Button>
    )}
    
    {order?.status === 'used' ? (
      <Button 
        type="default"
        icon={<CheckCircleFilled />}
        style={{ width: '100%' }}
        disabled
      >
        Đã sử dụng
      </Button>
    ) : order?.status === 'pending' ? (
      <Button 
        type="default"
        icon={<ClockCircleOutlined />}
        style={{ width: '100%' }}
        disabled
      >
        Chờ thanh toán
      </Button>
    ) : null}
    
    <Button 
      type="primary"
      icon={<DownloadOutlined />}
      style={{ 
        width: '100%', 
        marginTop: order?.status === 'pending' || order?.status === 'used' ? 0 : '8px'
      }}
      disabled={order?.status === 'pending'}
      onClick={async () => {
        try {
          message.loading({ content: 'Đang tạo vé...', key: 'downloadTicket' });
          
          const element = document.createElement('div');
          element.style.position = 'absolute';
          element.style.left = '-9999px';
          element.style.top = '0';
          element.style.width = '80mm';
          element.style.padding = '10px';
          element.style.background = '#fff';
          
          await new Promise(resolve => setTimeout(resolve, 100)); // Give QR code time to render
          const qrCodeCanvas = qrCodeRef.current?.querySelector('canvas');
          if (!qrCodeCanvas) {
            throw new Error('Không tìm thấy mã QR. Vui lòng thử lại.');
          }
          const qrCodeImage = qrCodeCanvas.toDataURL('image/png');

          const seatsInfo = order.seats?.map(seat => 
            `Ghế ${seat.label} (${formatCurrency(seat.price)})`
          ).join('<br>') || 'Chưa chọn ghế';

          const totalAmount = order.seats?.reduce((sum, seat) => sum + (seat.price || 0), 0) || 0;
          const currentTime = dayjs().format('HH:mm - DD/MM/YYYY');

          element.innerHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 100%;">
              <div style="text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #ddd; padding-bottom: 10px;">
                <h2 style="color: #1890ff; margin: 0 0 5px 0; font-size: 20px; text-transform: uppercase;">VÉ XEM PHIM</h2>
                <div style="font-weight: bold;">${order.cinemaName || 'Rạp Chiếu Phim'}</div>
              </div>
              
              <div style="font-size: 16px; font-weight: bold; margin: 10px 0; text-align: center;">
                ${order.movieName || 'Chưa có thông tin phim'}
              </div>
              
              <div style="margin: 15px 0; font-size: 13px;">
                <div style="display: flex; margin-bottom: 8px;">
                  <span style="font-weight: bold; min-width: 80px;">Suất chiếu:</span>
                  <span>${order.startTime ? dayjs(order.startTime).format('HH:mm - DD/MM/YYYY') : 'Chưa cập nhật'}</span>
                </div>
                <div style="display: flex; margin-bottom: 8px;">
                  <span style="font-weight: bold; min-width: 80px;">Phòng:</span>
                  <span>${order.roomName || 'Chưa cập nhật'}</span>
                </div>
                <div style="display: flex; margin-bottom: 8px;">
                  <span style="font-weight: bold; min-width: 80px;">Ghế:</span>
                  <span>${order.seats?.map(s => s.label).join(', ') || 'Chưa chọn ghế'}</span>
                </div>
                
                <div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                  <div style="font-weight: bold; margin-bottom: 5px;">CHI TIẾT VÉ</div>
                  <div>${seatsInfo}</div>
                  <div style="font-weight: bold; text-align: right; margin-top: 10px; color: #1890ff;">
                    Tổng cộng: ${formatCurrency(totalAmount)}
                  </div>
                </div>
                
                <div style="text-align: center; margin: 15px 0;">
                  <img src="${qrCodeImage}" alt="Mã QR" style="max-width: 150px; height: auto;" />
                  <div style="font-size: 12px; margin-top: 5px;">Quét mã QR để xác thực vé</div>
                </div>
                
                <div style="text-align: center; font-size: 12px; color: #666; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ddd;">
                  <div>Vui lòng đến rạp trước 15 phút</div>
                  <div>Xuất trình mã QR khi vào rạp</div>
                  <div style="margin-top: 10px; font-style: italic;">Cảm ơn quý khách!</div>
                  <div style="margin-top: 10px; font-size: 11px; color: #999;">
                    <div>Mã giao dịch: ${order.codePayment || 'N/A'}</div>
                    <div>Thời gian đặt: ${order.createdAt ? dayjs(order.createdAt).format('HH:mm - DD/MM/YYYY') : ''}</div>
                    <div>Ngày tải vé: ${currentTime}</div>
                  </div>
                </div>
              </div>
            </div>
          `;
          
          document.body.appendChild(element);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#fff'
          });
          
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 297] 
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 80; 
          const pageHeight = 297; 
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 10; 
          
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          // Add more pages if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          // Save the file
          const fileName = `ve-xem-phim-${order.id || 'ticket'}-${new Date().getTime()}.pdf`;
          pdf.save(fileName);
          
          // Clean up
          document.body.removeChild(element);
          
          message.success({ content: 'Đã tải xuống vé thành công!', key: 'downloadTicket' });
          
        } catch (error) {
          console.error('Lỗi khi tạo vé:', error);
          message.error({ content: 'Có lỗi xảy ra khi tạo vé: ' + (error.message || 'Vui lòng thử lại sau'), key: 'downloadTicket' });
        }
      }}
    >
      Tải xuống vé PDF
    </Button>
  </Space>
</Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderDetail;