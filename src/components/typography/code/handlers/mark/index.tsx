import { type AnnotationHandler, InnerLine } from 'codehike/code';

const mark: AnnotationHandler = {
  name: 'mark',
  Line: (props) => <InnerLine merge={props} className="px-4" />,
  AnnotatedLine: (props) => <InnerLine merge={props} className="bg-mark/25 px-4" />,
};

export default mark;
