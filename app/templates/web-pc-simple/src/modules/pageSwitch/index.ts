import { OriginAgent, sharing } from 'agent-reducer';
import { Path } from './type';

class PageSwitch implements OriginAgent<Path> {
  state: Path = 'home';

  switchTo(path: Path): Path {
    return path;
  }
}

export const pageSwitchRef = sharing(() => PageSwitch);
