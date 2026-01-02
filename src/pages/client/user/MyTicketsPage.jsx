import { Card, Empty, List } from "antd";
import { useUserSelector } from "../../../store/useUserStore";
import dayjs from "dayjs";

const MyTicketsPage = () => {
  const tickets = useUserSelector((s) => s.tickets || []);

  return (
    <div className="mt-8">
      <Card title="Lịch sử vé">
        {tickets.length === 0 ? (
          <Empty description="Bạn chưa có vé nào" />
        ) : (
          <List
            dataSource={tickets}
            renderItem={(item) => (
              <List.Item>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{item.movieName}</div>
                      <div className="text-sm text-gray-500">
                        {item.roomName} • {item.ticketId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {dayjs(item.startTime).format("HH:mm DD/MM/YYYY")}
                      </div>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default MyTicketsPage;
