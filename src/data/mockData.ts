import { User, Ticket } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    isAdmin: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'admin@example.com',
    isAdmin: true,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  }
];

export const mockTickets: Ticket[] = [
  {
    id: uuidv4(),
    title: 'Cannot access my account',
    description: 'I have been trying to log in to my account for the past two days but I keep getting an error message saying "Invalid credentials". I have tried resetting my password but I still cannot log in.',
    status: 'open',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    userId: '1',
    userName: 'John Doe',
    userEmail: 'user@example.com',
    comments: [
      {
        id: uuidv4(),
        content: 'I\'ve tried clearing my browser cache and cookies but that didn\'t help either.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isAdmin: false,
        attachments: []
      },
      {
        id: uuidv4(),
        content: 'I\'ll look into this right away. Could you please tell me which browser and operating system you\'re using?',
        createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
        userId: '2',
        userName: 'Jane Smith',
        userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isAdmin: true,
        attachments: []
      }
    ],
    attachments: [
      {
        id: uuidv4(),
        name: 'error_screenshot.png',
        url: 'https://via.placeholder.com/500x300?text=Error+Screenshot',
        size: 245000,
        type: 'image/png'
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Feature request: Dark mode',
    description: 'It would be great if you could add a dark mode option to the application. It would make it easier to use at night and would be better for battery life on mobile devices.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    userId: '1',
    userName: 'John Doe',
    userEmail: 'user@example.com',
    assignedToId: '2',
    assignedToName: 'Jane Smith',
    comments: [
      {
        id: uuidv4(),
        content: 'Thanks for the suggestion! We\'re actually working on a dark mode option right now. We\'ll update you when it\'s ready for testing.',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
        userId: '2',
        userName: 'Jane Smith',
        userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isAdmin: true,
        attachments: []
      },
      {
        id: uuidv4(),
        content: 'That\'s great news! Looking forward to it.',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isAdmin: false,
        attachments: []
      }
    ],
    attachments: []
  },
  {
    id: uuidv4(),
    title: 'Payment failed but money was deducted',
    description: 'I tried to make a payment yesterday but I got an error message saying the payment failed. However, the money was deducted from my account. My transaction ID is TX123456789.',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    userId: '1',
    userName: 'John Doe',
    userEmail: 'user@example.com',
    assignedToId: '2',
    assignedToName: 'Jane Smith',
    comments: [
      {
        id: uuidv4(),
        content: 'I\'ve checked your transaction and I can confirm that the payment did go through on our end. The error message was displayed due to a timeout issue. You should see the product in your account now.',
        createdAt: new Date(Date.now() - 86400000 * 6.5).toISOString(), // 6.5 days ago
        userId: '2',
        userName: 'Jane Smith',
        userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isAdmin: true,
        attachments: []
      },
      {
        id: uuidv4(),
        content: 'You\'re right, I can see it now. Thank you for your help!',
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isAdmin: false,
        attachments: []
      }
    ],
    attachments: [
      {
        id: uuidv4(),
        name: 'payment_receipt.pdf',
        url: 'https://via.placeholder.com/500x300?text=Payment+Receipt',
        size: 125000,
        type: 'application/pdf'
      }
    ]
  }
];