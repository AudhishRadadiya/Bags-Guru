import React, { memo } from 'react';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from './reactQuillHelper';

const ReactQuillEditor = ({
  name,
  value,
  onChange,
  modules = quillModules,
  formats = quillFormats,
  height = '150px',
  placeholder,
  touched,
  errors,
}) => {
  return (
    <>
      <ReactQuill
        theme="snow"
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        name={name}
        value={value}
        onChange={onChange}
        style={{ height }}
      />

      {touched?.source && errors?.source && (
        <p className="text-danger">{errors?.source}</p>
      )}
    </>
  );
};

export default memo(ReactQuillEditor);
