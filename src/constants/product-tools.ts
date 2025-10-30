import { LucideIcon, Image, Video, Wand2 } from 'lucide-react';

export const DEFAULT_TOOL_ID = 'image-generation';
export const DEFAULT_SECTION_ICON: LucideIcon = Wand2;

export interface SidebarSectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  targetProductId?: string;
  children?: {
    id: string;
    label: string;
    icon: LucideIcon;
    targetProductId?: string;
  }[];
}

export const SIDEBAR_SECTIONS: SidebarSectionConfig[] = [
  {
    id: 'image-generation',
    label: '图像生成',
    icon: Image,
  },
  {
    id: 'video-generation',
    label: '视频生成',
    icon: Video,
  },
  {
    id: 'ai-tools',
    label: 'AI工具',
    icon: Wand2,
    children: [
      {
        id: 'text-to-image',
        label: '文本转图像',
        icon: Image,
      },
      {
        id: 'text-to-video',
        label: '文本转视频',
        icon: Video,
      },
    ],
  },
];

interface ToolContent {
  title: string;
  description: string;
  promptPlaceholder: string;
  resultPlaceholder: string;
  primaryButton: string;
  ratios: string[];
  maxImages: number;
}

export const TOOL_CONTENT: Record<string, ToolContent> = {
  'image-generation': {
    title: '图像生成',
    description: '使用AI创建令人惊叹的图像',
    promptPlaceholder: '描述您想要生成的图像...',
    resultPlaceholder: '生成的图像将在此处显示',
    primaryButton: '生成图像',
    ratios: ['1:1', '16:9', '9:16', '4:3'],
    maxImages: 4,
  },
  'video-generation': {
    title: '视频生成',
    description: '使用AI创建动态视频内容',
    promptPlaceholder: '描述您想要生成的视频...',
    resultPlaceholder: '生成的视频将在此处显示',
    primaryButton: '生成视频',
    ratios: ['16:9', '9:16', '1:1'],
    maxImages: 2,
  },
  'text-to-image': {
    title: '文本转图像',
    description: '将文本描述转换为图像',
    promptPlaceholder: '输入文本描述...',
    resultPlaceholder: '生成的图像将在此处显示',
    primaryButton: '转换',
    ratios: ['1:1', '16:9', '9:16'],
    maxImages: 3,
  },
  'text-to-video': {
    title: '文本转视频',
    description: '将文本描述转换为视频',
    promptPlaceholder: '输入文本描述...',
    resultPlaceholder: '生成的视频将在此处显示',
    primaryButton: '转换',
    ratios: ['16:9', '9:16'],
    maxImages: 1,
  },
};
