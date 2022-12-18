
import React, { FC } from 'react';

interface Props {
  name: string,
  value: string
}

const TextareaComp: FC<Props> = props  => {
  const { value } = props;
  return (
    <>
      <textarea value={value} ></textarea>
    </>
  );
};

export default TextareaComp;
