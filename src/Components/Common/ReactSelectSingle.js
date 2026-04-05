import { Dropdown } from 'primereact/dropdown';
import { memo } from 'react';

const ReactSelectSingle = ({
  placeholder,
  value,
  options,
  onChange,
  filter,
  name,
  disabled,
  style,
  onBlur,
  optionGroupLabel,
  optionGroupChildren,
  optionGroupTemplate,
  className,
  itemTemplate,
  showClear,
  ...props
}) => {
  return (
    <Dropdown
      value={value}
      filter={filter}
      disabled={disabled}
      showClear={showClear}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      name={name}
      onBlur={onBlur}
      itemTemplate={itemTemplate}
      optionGroupLabel={optionGroupLabel}
      optionGroupChildren={optionGroupChildren}
      optionGroupTemplate={optionGroupTemplate}
      className={className}
      {...props}
    />
  );
};

export default memo(ReactSelectSingle);
