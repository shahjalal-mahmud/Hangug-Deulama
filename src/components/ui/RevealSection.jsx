import useScrollReveal from '../../hooks/useScrollReveal';

const RevealSection = ({ as: Tag = 'div', className = '', children, ...rest }) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-cinematic will-change-transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default RevealSection;