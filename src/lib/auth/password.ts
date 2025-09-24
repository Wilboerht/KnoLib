/**
 * 密码加密和验证工具
 */

import bcrypt from 'bcryptjs';

// 盐值轮数，数值越高越安全但计算时间越长
const SALT_ROUNDS = 12;

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('密码加密失败');
  }
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 最小长度检查
  if (password.length < 8) {
    errors.push('密码长度至少为8位');
  }

  // 最大长度检查
  if (password.length > 128) {
    errors.push('密码长度不能超过128位');
  }

  // 包含大写字母
  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母');
  }

  // 包含小写字母
  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母');
  }

  // 包含数字
  if (!/\d/.test(password)) {
    errors.push('密码必须包含至少一个数字');
  }

  // 包含特殊字符
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符');
  }

  // 不能包含常见的弱密码
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('密码过于简单，请使用更复杂的密码');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 生成随机密码
 */
export function generateRandomPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // 确保至少包含每种类型的字符
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // 填充剩余长度
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // 打乱字符顺序
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
