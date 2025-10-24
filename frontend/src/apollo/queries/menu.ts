import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { MenuItem } from "../../interfaces/menu";

export type MainMenuType = {
  rootMenuItems: MenuItem[];
};

export const MENU_QUERY: TypedDocumentNode<MainMenuType, {}> = gql`
  query GetMenuItems {
    rootMenuItems {
      id
      title
      icon
      url
      order
      notificationCount
      hasChildren
      children {
        id
        title
        icon
        url
        order
        notificationCount
        hasChildren
        children {
          id
          title
          icon
          url
          order
          notificationCount
          hasChildren
          children {
            id
            title
            icon
            url
            order
            notificationCount
          }
        }
      }
    }
  }
`;
