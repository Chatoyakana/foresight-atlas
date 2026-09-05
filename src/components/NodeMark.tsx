import { Diamond, Sparkles } from 'lucide-react';
import { palette, type AtlasNode } from '../data/atlas';

export default function NodeMark({ node, size = 36 }: { node: AtlasNode; size?: number }) {
  const color = palette[node.type];
  return (
    <span className={`node-mark node-mark-${node.type}`} style={{ width: size, height: size, background: color.soft, color: color.ink, borderColor: color.stroke, fontSize: size * 0.31 }} aria-hidden="true">
      {node.type === 'author' ? node.initials : node.type === 'method' ? <Diamond size={size * 0.38} strokeWidth={1.6} /> : <Sparkles size={size * 0.4} strokeWidth={1.5} />}
    </span>
  );
}