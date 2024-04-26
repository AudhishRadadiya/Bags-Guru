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
}) => {
  return (
    <Dropdown
      value={value}
      filter={filter}
      disabled={disabled}
      // showClear
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      name={name}
      onBlur={onBlur}
      optionGroupLabel={optionGroupLabel}
      optionGroupChildren={optionGroupChildren}
      optionGroupTemplate={optionGroupTemplate}
      className={className}
    />
  );
};

export default memo(ReactSelectSingle);
