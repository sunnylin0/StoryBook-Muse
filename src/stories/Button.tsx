import  React  from 'react';
import internal from 'stream';
import './button.css';

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   * 這是中文的
   */  
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
    size?: 'small' | 'medium' | 'large';

    X?: number;
    Y?: number;

  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
    onClick?: () => void;

    /**
     * 多的 about
     */
    onAbout?: () => void;
    onAbout3?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
    label,
    X,
    Y,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
