import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { QUERYKEY } from "../../../../common/constants/queryKey";
import { getDetailMovie } from "../../../../common/services/movie.service";
import { getAgeBadge } from "../../../../common/utils/agePolicy";
import ModalTrailer from "./components/ModalTrailer";
import ModalDescription from "./components/ModalDescription";

const DetailMovie = () => {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: [QUERYKEY.MOVIE, id],
    queryFn: () => getDetailMovie(id),
  });

  const movie = data?.data;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div
        style={{
          height: 600,
          backgroundImage: `linear-gradient(to top, rgba(16,20,27,1) 0%, rgba(16,20,27,0.85) 50%, rgba(16,20,27,0.85) 80%, rgba(16,20,27,0.6) 100%), url(${movie?.poster})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="flex items-center"
      >
        <div className="max-w-7xl xl:mx-auto mx-6 flex-1 flex items-start gap-8">
          <img
            src={movie?.poster}
            className="w-[365px] h-[485px] rounded-2xl"
            alt=""
          />

          <div className="p-6 font-medium relative text-base leading-6 flex-1 cursor-default select-none">
            <div className="min-h-[340px]">
              <h2 className="text-2xl font-semibold uppercase tracking-wider">
                {movie?.name}
              </h2>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-base">Quốc gia: {movie?.country}</p>
                <p className="text-base">Ngôn ngữ: {movie?.language}</p>
                <p className="text-base">
                  Phụ đề: {movie?.subLanguage || "Chưa cập nhật"}
                </p>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <p className="text-base">Thời lượng: {movie?.duration} phút</p>
                <p className="text-base">Đạo diễn: {movie?.director}</p>
              </div>

              <p
                className="mt-2 line-clamp-1 wrap-break-word whitespace-normal"
                title={`${movie?.actor?.join(", ")} và một số diễn viên khác.`}
              >
                Diễn viên: {movie?.actor?.join(", ")} và một số diễn viên khác.
              </p>

              <p
                className="mt-2 line-clamp-1 wrap-break-word whitespace-normal"
                title={movie?.category?.map((item) => item.name).join(", ")}
              >
                Thể loại: {movie?.category?.map((item) => item.name).join(", ")}
              </p>

              <p
                className="mt-2 line-clamp-5 wrap-break-word whitespace-normal"
                title={movie?.description}
              >
                Nội dung: {movie?.description || "Chưa cập nhật"}
              </p>
            </div>

            <p className="text-[18px] text-primary line-clamp-1">
              Kiểm duyệt: {getAgeBadge(movie?.ageRequire).text} -{" "}
              {getAgeBadge(movie?.ageRequire).description}
            </p>

            <div className="flex items-center gap-6 absolute -bottom-14">
              <ModalDescription
                description={movie?.description}
                movieName={movie?.name}
              >
                <p className="underline hover:text-primary duration-300 cursor-pointer">
                  Nội dung phim
                </p>
              </ModalDescription>

              <ModalTrailer movie={movie}>
                <button className="py-2.5 px-8 border-yellow-300 text-yellow-300 border rounded-full hover:bg-yellow-300 hover:text-white duration-300 cursor-pointer">
                  Xem trailer
                </button>
              </ModalTrailer>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default DetailMovie;
