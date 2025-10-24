export interface MenuItem {
  id: number
  title: string
  icon?: string
  url?: string
  order: number
  notificationCount: number
  hasChildren: boolean
  children?: MenuItem[]
  parent?: MenuItem
}

export interface MenuItemInput {
  title: string
  icon?: string
  url?: string
  parentId?: number
  order?: number
  notificationCount?: number
}