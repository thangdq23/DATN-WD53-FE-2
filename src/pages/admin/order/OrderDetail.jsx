import React, { useEffect, useState } from 'react';
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
  TagOutlined
} from '@ant-design/icons';
import { getDetailOrder } from '../../../common/services/order.service';
import { formatCurrency } from '../../../common/utils';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

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
    padding: '24px',
    gap: '16px'  // Add gap between elements
  }}
>
  {/* QR Code */}
  {order?.ticketId ? (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        padding: '16px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        marginBottom: '16px'
      }}>
        <QRCode 
          value={order.ticketId}
          size={160}
          color="#000"
          bgColor="#ffffff"
          errorLevel="H"
        />
      </div>
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
    <Button 
      type="primary" 
      icon={<CheckCircleOutlined />}
      style={{ width: '100%' }}
      disabled={order?.status === 'USED'}
      onClick={() => {
        message.success('Đã xác nhận sử dụng vé thành công');
      }}
    >
      {order?.status === 'USED' ? 'Đã sử dụng' : 'Xác nhận sử dụng vé'}
    </Button>
    
    <Button 
      type="default" 
      icon={<PrinterOutlined />}
      style={{ width: '100%' }}
      onClick={() => {
        const printWindow = window.open('', '_blank');
        const qrCodeImage = document.querySelector('.ant-qr-code canvas')?.toDataURL();
        
        if (!qrCodeImage) {
          message.error('Không thể tạo mã QR để in');
          return;
        }

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Vé xem phim - ${order.movieName || ''}</title>
              <style>
                @page { 
                  size: auto; 
                  margin: 0; 
                }
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 20px;
                  margin: 0;
                }
                .ticket { 
                  max-width: 300px; 
                  margin: 0 auto; 
                  border: 2px dashed #1890ff;
                  padding: 20px;
                  border-radius: 8px;
                  text-align: center;
                }
                .header { margin-bottom: 15px; }
                .header h2 { 
                  color: #1890ff; 
                  margin: 0 0 5px 0;
                  font-size: 18px;
                }
                .info { 
                  margin: 15px 0; 
                  text-align: left;
                  padding: 0 10px;
                  font-size: 14px;
                }
                .info div { margin: 8px 0; }
                .qr-code { 
                  margin: 15px auto;
                  padding: 10px;
                  background: white;
                  display: inline-block;
                }
                .footer { 
                  margin-top: 15px; 
                  font-size: 12px; 
                  color: #666;
                  border-top: 1px solid #f0f0f0;
                  padding-top: 10px;
                }
                @media print {
                  body { 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="ticket">
                <div class="header">
                  <h2>VÉ XEM PHIM</h2>
                  <div>${order.movieName || ''}</div>
                </div>
                <div class="info">
                  <div><strong>Rạp:</strong> ${order.roomName || 'Chưa cập nhật'}</div>
                  <div><strong>Suất chiếu:</strong> ${order.startTime ? dayjs(order.startTime).format('HH:mm - DD/MM/YYYY') : ''}</div>
                  <div><strong>Ghế:</strong> ${order.seats?.map(s => s.label).join(', ') || 'Chưa chọn ghế'}</div>
                  <div><strong>Mã vé:</strong> ${order.ticketId}</div>
                </div>
                <div class="qr-code">
                  <img src="${qrCodeImage}" width="160" alt="Mã QR" />
                </div>
                <div class="footer">
                  <p>Vui lòng đến rạp trước 15 phút để làm thủ tục đổi vé</p>
                  <p>Xin cảm ơn và chúc quý khách xem phim vui vẻ!</p>
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }}
    >
      In vé
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