import { EditOutlined, LockOutlined, UnlockOutlined, InfoCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, Tag, Tooltip, Card, Badge, Space, Divider } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from "react-router";
import { updateStatusRoom } from "../../../../common/services/room.service";
import { useMessage } from "../../../../common/hooks/useMessage";
import { QUERY } from "../../../../common/constants/queryKey";

export const columnRoom = () => {
  const { antdMessage, HandleError } = useMessage();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id) => updateStatusRoom(id),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(QUERY.ROOM),
      });
    },
    onError: (err) => HandleError(err),
  });
  return [
    {
      title: 'Phòng chiếu',
      key: 'room',
      className: 'room-card-column',
      render: (_, record) => (
        <Card 
          hoverable
          className="room-card"
          data-status={record.status ? 'active' : 'inactive'}
          bodyStyle={{ padding: '16px' }}
          headStyle={{
            borderBottom: '1px solid #f0f0f0',
            padding: '0 16px',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 m-0">
                  {record.name}
                </h3>
                <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  record.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {record.status ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <span className="inline-flex items-center mr-4">
                  <TeamOutlined className="mr-1" />
                  {record.capacity} ghế
                </span>
                <span className="inline-flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-1 ${record.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {record.status ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
              </div>
              
              {record.description && (
                <div className="text-sm text-gray-600 mb-3">
                  <p className="m-0">{record.description}</p>
                </div>
              )}
              
              <div className="flex items-center text-xs text-gray-500">
                <InfoCircleOutlined className="mr-1" />
                ID: {record._id.slice(-8)}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Tooltip title="Chỉnh sửa">
                <Link to={`/admin/rooms/update/${record._id}`}>
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    className="text-blue-500 hover:bg-blue-50"
                  />
                </Link>
              </Tooltip>
              
              {record.status ? (
                <Popconfirm
                  title={
                    <div className="max-w-[200px]">
                      <p className="font-medium mb-1">Xác nhận khóa phòng</p>
                      <p className="text-sm text-gray-600">Bạn có chắc chắn muốn khóa phòng này?</p>
                    </div>
                  }
                  icon={<ExclamationCircleOutlined className="text-yellow-500" />}
                  okText="Khóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => mutate(record._id)}
                >
                  <Button 
                    type="text" 
                    icon={<LockOutlined />} 
                    className="text-gray-500 hover:bg-gray-100"
                    loading={isPending}
                  />
                </Popconfirm>
              ) : (
                <Tooltip title="Mở khóa phòng">
                  <Button 
                    type="text" 
                    icon={<UnlockOutlined />} 
                    className="text-green-500 hover:bg-green-50"
                    onClick={() => mutate(record._id)}
                    loading={isPending}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </Card>
      ),
    },
  ];
};

const styles = `
  .room-card {
    border-radius: 10px;
    border-left: 4px solid transparent;
    border-left-color: ${props => props.theme.roomCard.border};
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    
    /* Status indicator */
    &[data-status="active"] {
      border-left-color: #10B981;
      
      .ant-card-head {
        border-left: 4px solid #10B981;
      }
    }
    
    &[data-status="inactive"] {
      border-left-color: #EF4444;
      opacity: 0.85;
      
      .ant-card-head {
        border-left: 4px solid #EF4444;
      }
    }
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
    margin-bottom: 16px;
  }
  
  .room-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0,0.1);
    transform: translateY(-2px);
  }
  
  .room-card .ant-card-body {
    padding: 16px;
  }
  
  .room-card-column {
    padding: 0 !important;
  }
  
  .room-card-column .ant-table-cell {
    padding: 0 !important;
    border: none !important;
    background: none !important;
  }
  
  .room-card-column + .room-card-column .room-card {
    margin-top: 16px;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
