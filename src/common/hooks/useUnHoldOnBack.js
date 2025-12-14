import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthSelector } from "../../store/useAuthStore";
import { getSocket } from "../../socket/socket-client";
import { unHoldSeat } from "../services/seat.showtime.service";
import { QUERYKEY } from "../constants/queryKey";

export const useUnHoldOnBack = (enableBlockPop = true) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const handled = useRef(false);
  const socket = getSocket();
  const userId = useAuthSelector((state) => state.user?._id);

  const { mutate } = useMutation({
    mutationFn: unHoldSeat,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SEAT),
      });
    },
  });

  useEffect(() => {
    let handlePopState = null;

    if (enableBlockPop) {
      handlePopState = () => {
        if (handled.current) return;
        handled.current = true;
        mutate();
        nav(-2);
      };

      window.addEventListener("popstate", handlePopState);
    }

    const handlePageHide = () => {
      socket?.emit("closeTabCheckout", { userId });
    };

    window.addEventListener("pagehide", handlePageHide);

    window.history.pushState(null, "", window.location.href);

    return () => {
      if (handlePopState) {
        window.removeEventListener("popstate", handlePopState);
      }
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [enableBlockPop, socket, nav, mutate, userId]);
};
