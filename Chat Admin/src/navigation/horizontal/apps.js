// ** Icons Import
import {
  Box,
  Mail,
  User,
  Circle,
  Shield,
  Calendar,
  FileText,
  CheckSquare,
  ShoppingCart,
  MessageSquare
} from 'react-feather'

export default [
  {
    id: 'chats',
    title: 'Chat App',
    icon: <Box />,
    children: [
      {
        id: 'chat',
        title: 'Chat',
        icon: <MessageSquare />,
        navLink: '/apps/chat'
      }
    ]
  }
]
