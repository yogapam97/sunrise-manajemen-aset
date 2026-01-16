"use client";

import type { IMemberItem } from "src/types/member";
//
import type {
  IWorkspaceItem,
  WorkspaceStateType,
  WorkspaceActionMapType,
} from "src/types/workspace";

import { useMemo, useEffect, useReducer, useCallback } from "react";

// utils
import axios, { endpoints } from "src/utils/axios";

import { setActiveWorkspace } from "./utils";
import { WorkspaceContext } from "./workspace-context";

enum Types {
  INITIAL = "INITIAL",
  SET_WORKSPACE = "SET_WORKSPACE",
  SET_MEMBER = "SET_MEMBER",
  SET_MEMBER_LOADING = "SET_MEMBER_LOADING",
}

type Payload = {
  [Types.INITIAL]: {
    workspace: IWorkspaceItem | null;
  };
  [Types.SET_WORKSPACE]: {
    workspace: IWorkspaceItem | null;
  };
  [Types.SET_MEMBER]: {
    member: IMemberItem | null;
  };
  [Types.SET_MEMBER_LOADING]: {
    memberLoading: boolean;
  };
};

type ActionsType = WorkspaceActionMapType<Payload>[keyof WorkspaceActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: WorkspaceStateType = {
  workspace: null,
  member: null,
  loading: true,
  memberLoading: false,
};

const reducer = (state: WorkspaceStateType, action: ActionsType): WorkspaceStateType => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      workspace: action.payload.workspace,
      member: state.member,
      memberLoading: state.memberLoading,
    };
  }
  if (action.type === Types.SET_WORKSPACE) {
    return {
      ...state,
      workspace: action.payload.workspace,
    };
  }
  if (action.type === Types.SET_MEMBER) {
    return {
      ...state,
      member: action.payload.member,
    };
  }
  if (action.type === Types.SET_MEMBER_LOADING) {
    return {
      ...state,
      memberLoading: action.payload.memberLoading,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = "workspace";

type Props = {
  children: React.ReactNode;
};

export function WorkspaceProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const currentWorkspace = sessionStorage.getItem(STORAGE_KEY);

      if (currentWorkspace && accessToken) {
        const activeWorkspace: IWorkspaceItem = JSON.parse(currentWorkspace);

        const response = await axios.get(`${endpoints.workspace}/${activeWorkspace?.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Workspace-Id": activeWorkspace?.id,
          },
        });

        const { data: workspace } = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            workspace,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            workspace: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          workspace: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // SET_WORKSPACE
  const setWorkspace = useCallback(async (workspace: IWorkspaceItem | null) => {
    setActiveWorkspace(workspace);

    dispatch({
      type: Types.SET_WORKSPACE,
      payload: {
        workspace,
      },
    });
  }, []);

  // SET_MEMBER
  const setMember = useCallback(async (member: IMemberItem | null) => {
    dispatch({
      type: Types.SET_MEMBER,
      payload: {
        member,
      },
    });
  }, []);

  // SET_MEMBER
  const setMemberLoading = useCallback(async (loading: boolean) => {
    dispatch({
      type: Types.SET_MEMBER_LOADING,
      payload: { memberLoading: loading },
    });
  }, []);

  // ----------------------------------------------------------------------
  const memoizedValue = useMemo(
    () => ({
      workspace: state.workspace,
      member: state.member,
      workspaceSelected: Boolean(state.workspace),
      loading: state.loading,
      memberLoading: state.memberLoading,
      setWorkspace,
      setMember,
      setMemberLoading,
    }),
    [state, setWorkspace, setMember, setMemberLoading]
  );

  return <WorkspaceContext.Provider value={memoizedValue}>{children}</WorkspaceContext.Provider>;
}
