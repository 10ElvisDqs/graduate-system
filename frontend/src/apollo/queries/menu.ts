import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { MenuItem } from "../../interfaces/menu";

export type MainMenuType = {
  rootMenuItems: MenuItem[];
};
export type MenuItemChildren = {
  menuItem: MenuItem[];
};

export type RootQueryData = {
  rootMenuItems: MenuItem[];
}

export interface MenuItemResponse {
  menuItem: {
    children: MenuItem[];
  };
}

export interface ChildQueryData {
  childMenuItems: MenuItem[];
}

export interface ChildQueryVars {
  parentId: string;
}

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


export const GET_ROOT_MENU_ITEMS = gql`
  query GetRootMenuItems {
    rootMenuItems {
      id
      title
      icon
      url
      order
    }
  }
`;

/**
 * Consulta para obtener los items hijos de un menú específico.
 * * IMPORTANTE: 
 * - El nombre de la query ('childMenuItems') 
 * - El nombre del argumento ('parentId')
 * * ...deben coincidir EXACTAMENTE con tu esquema de GraphQL.
 * Ajusta esto según sea necesario.
 */
export const GET_CHILD_MENU_ITEMS:TypedDocumentNode<MenuItemResponse, {}> = gql`
  query GetChildMenuItems($id: Int!) {

    menuItem(id: $id) {
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