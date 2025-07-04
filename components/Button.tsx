import { Pressable, Text } from 'react-native';
import { cn } from '~/lib/utils';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  cls?: string;
};

export const AppButton = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  cls = '',
}: Props) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={cn(
      'h-12 items-center justify-center rounded-md',
      variant === 'primary'
        ? 'bg-darkGreen' // ⬅️ your theme colour
        : 'border border-darkGreen',
      disabled && 'opacity-50',
      cls
    )}>
    <Text
      className={
        variant === 'primary'
          ? 'text-base font-semibold text-white'
          : 'text-base font-semibold text-darkGreen'
      }>
      {title}
    </Text>
  </Pressable>
);
