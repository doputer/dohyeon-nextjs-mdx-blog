import { type AnnotationHandler, InnerLine } from 'codehike/code';

const mark: AnnotationHandler = {
  name: 'mark',
  Line: (props) => <InnerLine merge={props} className="px-4" />,
  AnnotatedLine: (props) => <InnerLine merge={props} className="bg-accent/10 px-4" />,
};

export default mark;
