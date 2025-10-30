interface Example {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
}

const examplesByCategory: Record<string, Example[]> = {
  'image-generation': [
    { id: '1', title: '风景画', description: '生成美丽的自然风景图像' },
    { id: '2', title: '人物肖像', description: '创建逼真的人物肖像' },
    { id: '3', title: '抽象艺术', description: '探索抽象艺术风格' },
  ],
  'video-generation': [
    { id: '1', title: '动画短片', description: '制作简短的动画视频' },
    { id: '2', title: '产品展示', description: '创建产品演示视频' },
  ],
};

export function getExamplesByCategory(categoryId: string): Example[] {
  return examplesByCategory[categoryId] || [];
}
