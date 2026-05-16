import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import { Path, Svg } from 'react-native-svg';

export function Store({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 9l2.5-5h13L21 9M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 20v-6h6v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
