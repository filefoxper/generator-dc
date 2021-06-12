import React, {memo, ReactNode} from "react";
import classNames from "classnames";
import css from "./style.less";

interface ContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export const Container = memo(({ children, className }: ContainerProps) => {
  return <div className={classNames(css.container, className)}>{children}</div>;
});

export const SlideLeft = memo(({ children, className }: ContainerProps) => {
  return <div className={classNames(css.left, className)}>{children}</div>;
});

export const SlideContainer = memo(
  ({ children, className }: ContainerProps) => {
    return (
      <div className={classNames(css.container, css.slide, className)}>
        {children}
      </div>
    );
  }
);

interface DecoratorProps {
  readonly title: string;
  readonly desc?: string;
  readonly className?: string;
}

export const Decorator = memo(({ title, desc, className }: DecoratorProps) => {
  return (
    <div className={classNames(css.dev, className)}>
      <span className={css.title}>{title}</span>
      <span className={css.desc}>{desc}</span>
    </div>
  );
});

interface DevelopingProps {
  readonly title: string;
  readonly className?: string;
}

export const Developing = memo(({ title, className }: DevelopingProps) => {
  return (
    <Decorator title={title} className={className} desc="正在开发中......" />
  );
});
