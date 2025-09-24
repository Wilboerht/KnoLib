"use client";

import * as React from "react";
import {
  ChevronDown,
  Search,
  X,
  Monitor,
  Server,
  Code,
  Database,
  Cloud,
  Briefcase,
  Heart,
  GraduationCap,
  Car,
  Gamepad2,
  Home,
  Cog,
  MessageCircle,
  Trophy,
  Leaf,
  Shield,
  FileText,
  Globe,
  Clock,
  Star,
  Settings,
  Calculator,
  Palette,
  Smartphone,
  Laptop,
  Wifi,
  Terminal,
  Github,
  DollarSign,
  TrendingUp,
  Building,
  Stethoscope,
  Pill,
  BookOpen,
  School,
  Pencil,
  Truck,
  Plane,
  Music,
  Camera,
  ShoppingCart,
  Coffee,
  Wrench,
  Mail,
  Phone,
  Users,
  Sun,
  Lightbulb,
  Rocket,
  // 更多技术图标
  Cpu,
  HardDrive,
  Bluetooth,
  Webcam,
  MousePointer,
  Keyboard,
  Microchip,
  Binary,
  Bug,
  Layers,
  Package2,
  Workflow,
  Network,
  Plug,
  Power,
  Satellite,
  Radar,
  // 更多商业图标
  CreditCard,
  PiggyBank,
  TrendingDown,
  BarChart3,
  PieChart,
  Building2,
  Factory,
  Store,
  Banknote,
  Coins,
  Wallet,
  Receipt,
  LineChart,
  BarChart,
  Percent,
  Euro,
  PoundSterling,
  // 更多医疗图标
  Syringe,
  Thermometer,
  Activity,
  Brain,
  Eye,
  Ear,
  Smile,
  Frown,
  Bandage,
  Cross,
  HeartPulse,
  Tablets,
  Dna,
  Microscope,
  TestTube,
  FlaskConical,
  // 更多教育图标
  Library,
  PenTool,
  Eraser,
  Ruler,
  BookMarked,
  Presentation,
  Notebook,
  PenSquare,
  Edit,
  FileEdit,
  Copy,
  // 更多交通图标
  Bus,
  Bike,
  Ship,
  Train,
  Fuel,
  MapPin,
  Navigation,
  Sailboat,
  Anchor,
  Compass,
  Map,
  // 更多娱乐图标
  Dice1,
  Music2,
  Radio,
  Tv,
  Film,
  Image,
  Video,
  Mic,
  Speaker,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  // 更多生活图标
  ShoppingBag,
  Utensils,
  Pizza,
  IceCream,
  Shirt,
  Scissors,
  Hammer,
  Bed,
  Bath,
  Sofa,
  Lamp,
  Key,
  Lock,
  Unlock,
  Bell,
  // 更多工业图标
  Drill,
  Package,
  Warehouse,
  // 更多社交图标
  MessageSquare,
  Share,
  ThumbsUp,
  ThumbsDown,
  // 更多体育图标
  Dumbbell,
  Medal,
  Timer,
  // 更多自然图标
  TreePine,
  Moon,
  CloudRain,
  Snowflake,
  Wind,
  Flame,
  Droplets,
  Recycle,
  Mountain,
  Trees,
  // 更多安全图标
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  // 更多办公图标
  FileImage,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  Archive,
  Clipboard,
  // 更多网络图标
  Rss,
  Podcast,
  Signal,
  Antenna,
  // 更多时间图标
  Calendar,
  CalendarDays,
  Hourglass,
  // 更多通用图标
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

// 图标分类定义
const ICON_CATEGORIES = [
  { id: 'all', name: '全部', icon: Star },
  { id: 'technology', name: '技术开发', icon: Code },
  { id: 'business', name: '商业金融', icon: Briefcase },
  { id: 'health', name: '医疗健康', icon: Heart },
  { id: 'education', name: '教育学习', icon: GraduationCap },
  { id: 'transport', name: '交通运输', icon: Car },
  { id: 'entertainment', name: '娱乐休闲', icon: Gamepad2 },
  { id: 'lifestyle', name: '生活服务', icon: Home },
  { id: 'industrial', name: '工业制造', icon: Cog },
  { id: 'social', name: '社交通信', icon: MessageCircle },
  { id: 'sports', name: '体育运动', icon: Trophy },
  { id: 'nature', name: '环境自然', icon: Leaf },
  { id: 'security', name: '安全防护', icon: Shield },
  { id: 'office', name: '文档办公', icon: FileText },
  { id: 'network', name: '网络通信', icon: Globe },
  { id: 'time', name: '时间日期', icon: Clock },
  { id: 'general', name: '通用图标', icon: Star }
];

// 预定义的图标列表
const ICON_OPTIONS = [
  // 技术开发类
  { name: 'Monitor', icon: Monitor, label: '显示器', category: 'technology' },
  { name: 'Server', icon: Server, label: '服务器', category: 'technology' },
  { name: 'Code', icon: Code, label: '代码', category: 'technology' },
  { name: 'Database', icon: Database, label: '数据库', category: 'technology' },
  { name: 'Cloud', icon: Cloud, label: '云计算', category: 'technology' },
  { name: 'Smartphone', icon: Smartphone, label: '智能手机', category: 'technology' },
  { name: 'Laptop', icon: Laptop, label: '笔记本', category: 'technology' },
  { name: 'Wifi', icon: Wifi, label: 'WiFi', category: 'technology' },
  { name: 'Terminal', icon: Terminal, label: '终端', category: 'technology' },
  { name: 'Github', icon: Github, label: 'GitHub', category: 'technology' },
  { name: 'Cpu', icon: Cpu, label: 'CPU', category: 'technology' },
  { name: 'HardDrive', icon: HardDrive, label: '硬盘', category: 'technology' },
  { name: 'Bluetooth', icon: Bluetooth, label: '蓝牙', category: 'technology' },
  { name: 'Webcam', icon: Webcam, label: '摄像头', category: 'technology' },
  { name: 'MousePointer', icon: MousePointer, label: '鼠标', category: 'technology' },
  { name: 'Keyboard', icon: Keyboard, label: '键盘', category: 'technology' },
  { name: 'Microchip', icon: Microchip, label: '芯片', category: 'technology' },
  { name: 'Binary', icon: Binary, label: '二进制', category: 'technology' },
  { name: 'Bug', icon: Bug, label: '调试', category: 'technology' },
  { name: 'Layers', icon: Layers, label: '图层', category: 'technology' },
  { name: 'Package2', icon: Package2, label: '包管理', category: 'technology' },
  { name: 'Workflow', icon: Workflow, label: '工作流', category: 'technology' },
  { name: 'Network', icon: Network, label: '网络', category: 'technology' },
  { name: 'Plug', icon: Plug, label: '插件', category: 'technology' },
  { name: 'Power', icon: Power, label: '电源', category: 'technology' },
  { name: 'Satellite', icon: Satellite, label: '卫星', category: 'technology' },
  { name: 'Radar', icon: Radar, label: '雷达', category: 'technology' },

  // 商业金融类
  { name: 'Briefcase', icon: Briefcase, label: '商务', category: 'business' },
  { name: 'DollarSign', icon: DollarSign, label: '美元', category: 'business' },
  { name: 'TrendingUp', icon: TrendingUp, label: '增长', category: 'business' },
  { name: 'Building', icon: Building, label: '办公楼', category: 'business' },
  { name: 'CreditCard', icon: CreditCard, label: '信用卡', category: 'business' },
  { name: 'PiggyBank', icon: PiggyBank, label: '储蓄', category: 'business' },
  { name: 'TrendingDown', icon: TrendingDown, label: '下降', category: 'business' },
  { name: 'BarChart3', icon: BarChart3, label: '柱状图', category: 'business' },
  { name: 'PieChart', icon: PieChart, label: '饼图', category: 'business' },
  { name: 'Building2', icon: Building2, label: '大厦', category: 'business' },
  { name: 'Factory', icon: Factory, label: '工厂', category: 'business' },
  { name: 'Store', icon: Store, label: '商店', category: 'business' },
  { name: 'Banknote', icon: Banknote, label: '钞票', category: 'business' },
  { name: 'Coins', icon: Coins, label: '硬币', category: 'business' },
  { name: 'Wallet', icon: Wallet, label: '钱包', category: 'business' },
  { name: 'Receipt', icon: Receipt, label: '收据', category: 'business' },
  { name: 'LineChart', icon: LineChart, label: '折线图', category: 'business' },
  { name: 'BarChart', icon: BarChart, label: '条形图', category: 'business' },
  { name: 'Percent', icon: Percent, label: '百分比', category: 'business' },
  { name: 'Euro', icon: Euro, label: '欧元', category: 'business' },
  { name: 'PoundSterling', icon: PoundSterling, label: '英镑', category: 'business' },

  // 医疗健康类
  { name: 'Stethoscope', icon: Stethoscope, label: '听诊器', category: 'health' },
  { name: 'Heart', icon: Heart, label: '心脏', category: 'health' },
  { name: 'Pill', icon: Pill, label: '药丸', category: 'health' },
  { name: 'Syringe', icon: Syringe, label: '注射器', category: 'health' },
  { name: 'Thermometer', icon: Thermometer, label: '温度计', category: 'health' },
  { name: 'Activity', icon: Activity, label: '活动', category: 'health' },
  { name: 'Brain', icon: Brain, label: '大脑', category: 'health' },
  { name: 'Eye', icon: Eye, label: '眼睛', category: 'health' },
  { name: 'Ear', icon: Ear, label: '耳朵', category: 'health' },
  { name: 'Smile', icon: Smile, label: '微笑', category: 'health' },
  { name: 'Frown', icon: Frown, label: '皱眉', category: 'health' },
  { name: 'Bandage', icon: Bandage, label: '绷带', category: 'health' },
  { name: 'Cross', icon: Cross, label: '十字', category: 'health' },
  { name: 'HeartPulse', icon: HeartPulse, label: '心跳', category: 'health' },
  { name: 'Tablets', icon: Tablets, label: '药片', category: 'health' },
  { name: 'Dna', icon: Dna, label: 'DNA', category: 'health' },
  { name: 'Microscope', icon: Microscope, label: '显微镜', category: 'health' },
  { name: 'TestTube', icon: TestTube, label: '试管', category: 'health' },
  { name: 'FlaskConical', icon: FlaskConical, label: '锥形瓶', category: 'health' },

  // 教育学习类
  { name: 'GraduationCap', icon: GraduationCap, label: '毕业帽', category: 'education' },
  { name: 'BookOpen', icon: BookOpen, label: '打开的书', category: 'education' },
  { name: 'School', icon: School, label: '学校', category: 'education' },
  { name: 'Pencil', icon: Pencil, label: '铅笔', category: 'education' },
  { name: 'Library', icon: Library, label: '图书馆', category: 'education' },
  { name: 'PenTool', icon: PenTool, label: '钢笔', category: 'education' },
  { name: 'Eraser', icon: Eraser, label: '橡皮擦', category: 'education' },
  { name: 'Ruler', icon: Ruler, label: '尺子', category: 'education' },
  { name: 'BookMarked', icon: BookMarked, label: '书签', category: 'education' },
  { name: 'Presentation', icon: Presentation, label: '演示', category: 'education' },
  { name: 'Notebook', icon: Notebook, label: '笔记本', category: 'education' },
  { name: 'PenSquare', icon: PenSquare, label: '编辑', category: 'education' },
  { name: 'Edit', icon: Edit, label: '修改', category: 'education' },
  { name: 'FileEdit', icon: FileEdit, label: '文件编辑', category: 'education' },
  { name: 'Copy', icon: Copy, label: '复制', category: 'education' },

  // 交通运输类
  { name: 'Car', icon: Car, label: '汽车', category: 'transport' },
  { name: 'Truck', icon: Truck, label: '卡车', category: 'transport' },
  { name: 'Plane', icon: Plane, label: '飞机', category: 'transport' },
  { name: 'Bus', icon: Bus, label: '公交车', category: 'transport' },
  { name: 'Bike', icon: Bike, label: '自行车', category: 'transport' },
  { name: 'Ship', icon: Ship, label: '轮船', category: 'transport' },
  { name: 'Train', icon: Train, label: '火车', category: 'transport' },
  { name: 'Fuel', icon: Fuel, label: '燃料', category: 'transport' },
  { name: 'MapPin', icon: MapPin, label: '地图标记', category: 'transport' },
  { name: 'Navigation', icon: Navigation, label: '导航', category: 'transport' },
  { name: 'Sailboat', icon: Sailboat, label: '帆船', category: 'transport' },
  { name: 'Anchor', icon: Anchor, label: '锚', category: 'transport' },
  { name: 'Compass', icon: Compass, label: '指南针', category: 'transport' },
  { name: 'Map', icon: Map, label: '地图', category: 'transport' },

  // 娱乐休闲类
  { name: 'Gamepad2', icon: Gamepad2, label: '游戏手柄', category: 'entertainment' },
  { name: 'Music', icon: Music, label: '音乐', category: 'entertainment' },
  { name: 'Camera', icon: Camera, label: '相机', category: 'entertainment' },
  { name: 'Dice1', icon: Dice1, label: '骰子', category: 'entertainment' },
  { name: 'Music2', icon: Music2, label: '音符', category: 'entertainment' },
  { name: 'Radio', icon: Radio, label: '收音机', category: 'entertainment' },
  { name: 'Tv', icon: Tv, label: '电视', category: 'entertainment' },
  { name: 'Film', icon: Film, label: '电影', category: 'entertainment' },
  { name: 'Image', icon: Image, label: '图片', category: 'entertainment' },
  { name: 'Video', icon: Video, label: '视频', category: 'entertainment' },
  { name: 'Mic', icon: Mic, label: '麦克风', category: 'entertainment' },
  { name: 'Speaker', icon: Speaker, label: '扬声器', category: 'entertainment' },
  { name: 'Volume2', icon: Volume2, label: '音量', category: 'entertainment' },
  { name: 'VolumeX', icon: VolumeX, label: '静音', category: 'entertainment' },
  { name: 'Play', icon: Play, label: '播放', category: 'entertainment' },
  { name: 'Pause', icon: Pause, label: '暂停', category: 'entertainment' },
  { name: 'Square', icon: Square, label: '停止', category: 'entertainment' },
  { name: 'SkipForward', icon: SkipForward, label: '快进', category: 'entertainment' },
  { name: 'SkipBack', icon: SkipBack, label: '快退', category: 'entertainment' },
  { name: 'Shuffle', icon: Shuffle, label: '随机', category: 'entertainment' },
  { name: 'Repeat', icon: Repeat, label: '重复', category: 'entertainment' },

  // 生活服务类
  { name: 'Home', icon: Home, label: '家', category: 'lifestyle' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: '购物车', category: 'lifestyle' },
  { name: 'Coffee', icon: Coffee, label: '咖啡', category: 'lifestyle' },
  { name: 'ShoppingBag', icon: ShoppingBag, label: '购物袋', category: 'lifestyle' },
  { name: 'Utensils', icon: Utensils, label: '餐具', category: 'lifestyle' },
  { name: 'Pizza', icon: Pizza, label: '披萨', category: 'lifestyle' },
  { name: 'IceCream', icon: IceCream, label: '冰淇淋', category: 'lifestyle' },
  { name: 'Shirt', icon: Shirt, label: '衬衫', category: 'lifestyle' },
  { name: 'Scissors', icon: Scissors, label: '剪刀', category: 'lifestyle' },
  { name: 'Hammer', icon: Hammer, label: '锤子', category: 'lifestyle' },
  { name: 'Bed', icon: Bed, label: '床', category: 'lifestyle' },
  { name: 'Bath', icon: Bath, label: '浴缸', category: 'lifestyle' },
  { name: 'Sofa', icon: Sofa, label: '沙发', category: 'lifestyle' },
  { name: 'Lamp', icon: Lamp, label: '台灯', category: 'lifestyle' },
  { name: 'Key', icon: Key, label: '钥匙', category: 'lifestyle' },
  { name: 'Lock', icon: Lock, label: '锁', category: 'lifestyle' },
  { name: 'Unlock', icon: Unlock, label: '解锁', category: 'lifestyle' },
  { name: 'Bell', icon: Bell, label: '铃铛', category: 'lifestyle' },

  // 工业制造类
  { name: 'Wrench', icon: Wrench, label: '扳手', category: 'industrial' },
  { name: 'Cog', icon: Cog, label: '齿轮', category: 'industrial' },
  { name: 'Drill', icon: Drill, label: '钻头', category: 'industrial' },
  { name: 'Package', icon: Package, label: '包装', category: 'industrial' },
  { name: 'Warehouse', icon: Warehouse, label: '仓库', category: 'industrial' },

  // 社交通信类
  { name: 'MessageCircle', icon: MessageCircle, label: '消息', category: 'social' },
  { name: 'Mail', icon: Mail, label: '邮件', category: 'social' },
  { name: 'Phone', icon: Phone, label: '电话', category: 'social' },
  { name: 'Users', icon: Users, label: '用户', category: 'social' },
  { name: 'MessageSquare', icon: MessageSquare, label: '聊天', category: 'social' },
  { name: 'Share', icon: Share, label: '分享', category: 'social' },
  { name: 'ThumbsUp', icon: ThumbsUp, label: '点赞', category: 'social' },
  { name: 'ThumbsDown', icon: ThumbsDown, label: '点踩', category: 'social' },

  // 体育运动类
  { name: 'Trophy', icon: Trophy, label: '奖杯', category: 'sports' },
  { name: 'Dumbbell', icon: Dumbbell, label: '哑铃', category: 'sports' },
  { name: 'Medal', icon: Medal, label: '奖牌', category: 'sports' },
  { name: 'Timer', icon: Timer, label: '计时器', category: 'sports' },

  // 环境自然类
  { name: 'Leaf', icon: Leaf, label: '叶子', category: 'nature' },
  { name: 'Sun', icon: Sun, label: '太阳', category: 'nature' },
  { name: 'TreePine', icon: TreePine, label: '松树', category: 'nature' },
  { name: 'Moon', icon: Moon, label: '月亮', category: 'nature' },
  { name: 'CloudRain', icon: CloudRain, label: '下雨', category: 'nature' },
  { name: 'Snowflake', icon: Snowflake, label: '雪花', category: 'nature' },
  { name: 'Wind', icon: Wind, label: '风', category: 'nature' },
  { name: 'Flame', icon: Flame, label: '火焰', category: 'nature' },
  { name: 'Droplets', icon: Droplets, label: '水滴', category: 'nature' },
  { name: 'Recycle', icon: Recycle, label: '回收', category: 'nature' },
  { name: 'Mountain', icon: Mountain, label: '山', category: 'nature' },
  { name: 'Trees', icon: Trees, label: '树林', category: 'nature' },

  // 安全防护类
  { name: 'Shield', icon: Shield, label: '盾牌', category: 'security' },
  { name: 'ShieldCheck', icon: ShieldCheck, label: '安全检查', category: 'security' },
  { name: 'AlertTriangle', icon: AlertTriangle, label: '警告', category: 'security' },
  { name: 'AlertCircle', icon: AlertCircle, label: '提醒', category: 'security' },

  // 文档办公类
  { name: 'FileText', icon: FileText, label: '文档', category: 'office' },
  { name: 'FileImage', icon: FileImage, label: '图片文件', category: 'office' },
  { name: 'FileSpreadsheet', icon: FileSpreadsheet, label: '表格', category: 'office' },
  { name: 'Folder', icon: Folder, label: '文件夹', category: 'office' },
  { name: 'FolderOpen', icon: FolderOpen, label: '打开文件夹', category: 'office' },
  { name: 'Archive', icon: Archive, label: '归档', category: 'office' },
  { name: 'Clipboard', icon: Clipboard, label: '剪贴板', category: 'office' },

  // 网络通信类
  { name: 'Globe', icon: Globe, label: '全球', category: 'network' },
  { name: 'Rss', icon: Rss, label: 'RSS', category: 'network' },
  { name: 'Podcast', icon: Podcast, label: '播客', category: 'network' },
  { name: 'Signal', icon: Signal, label: '信号', category: 'network' },
  { name: 'Antenna', icon: Antenna, label: '天线', category: 'network' },

  // 时间日期类
  { name: 'Clock', icon: Clock, label: '时钟', category: 'time' },
  { name: 'Calendar', icon: Calendar, label: '日历', category: 'time' },
  { name: 'CalendarDays', icon: CalendarDays, label: '日期', category: 'time' },
  { name: 'Hourglass', icon: Hourglass, label: '沙漏', category: 'time' },

  // 通用图标类
  { name: 'Star', icon: Star, label: '星星', category: 'general' },
  { name: 'Lightbulb', icon: Lightbulb, label: '灯泡', category: 'general' },
  { name: 'Rocket', icon: Rocket, label: '火箭', category: 'general' },
  { name: 'Settings', icon: Settings, label: '设置', category: 'general' },
  { name: 'Calculator', icon: Calculator, label: '计算器', category: 'general' },
  { name: 'Palette', icon: Palette, label: '调色板', category: 'general' },
  { name: 'Zap', icon: Zap, label: '闪电', category: 'general' },
  { name: 'Target', icon: Target, label: '目标', category: 'general' },
];

// 组件接口定义
interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
  disabled?: boolean;
}

// 获取图标组件的辅助函数
function getIconComponent(iconName: string) {
  const iconOption = ICON_OPTIONS.find(option => option.name === iconName);
  return iconOption ? iconOption.icon : null;
}

export function IconSelector({ value, onChange, disabled }: IconSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");

  // 过滤图标
  const filteredIcons = React.useMemo(() => {
    let filtered = ICON_OPTIONS;

    // 按分类过滤
    if (activeCategory !== 'all') {
      filtered = filtered.filter(icon => icon.category === activeCategory);
    }

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeCategory, searchTerm]);

  // 获取当前选中的图标
  const selectedIcon = getIconComponent(value);

  // 处理图标选择
  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchTerm("");
  };

  // 处理分类切换
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchTerm(""); // 切换分类时清空搜索
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full justify-between h-10 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          {selectedIcon ? (
            <>
              {React.createElement(selectedIcon, { className: "h-4 w-4" })}
              <span className="text-sm">{value}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">选择图标</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-sm">
          {/* 搜索框 */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索图标..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 分类标签页 - 简化版 */}
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto scrollbar-hide p-1">
              {ICON_CATEGORIES.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`flex items-center justify-center p-2 m-0.5 rounded transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={category.name}
                  >
                    <CategoryIcon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 图标网格 */}
          <div className="p-3">
            {filteredIcons.length > 0 ? (
              <>
                <div className="text-xs text-gray-400 mb-2">
                  找到 {filteredIcons.length} 个图标
                </div>
                <div className="grid grid-cols-10 gap-1 max-h-80 overflow-y-auto">
                  {/* 无图标选项 */}
                  <button
                    onClick={() => handleIconSelect("")}
                    className={`flex items-center justify-center p-2 rounded transition-all hover:bg-gray-100 ${
                      value === ""
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600'
                    }`}
                    title="无图标"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* 图标选项 */}
                  {filteredIcons.map((iconOption) => {
                    const IconComponent = iconOption.icon;
                    return (
                      <button
                        key={iconOption.name}
                        onClick={() => handleIconSelect(iconOption.name)}
                        className={`flex items-center justify-center p-2 rounded transition-all hover:bg-gray-100 ${
                          value === iconOption.name
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600'
                        }`}
                        title={`${iconOption.label} (${iconOption.name})`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">未找到匹配的图标</p>
                <p className="text-xs text-gray-400 mt-1">尝试使用不同的关键词</p>
              </div>
            )}
          </div>

          {/* 关闭按钮 */}
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="w-full px-3 py-1.5 text-xs text-gray-500 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}