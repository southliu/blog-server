export class CreateRoleDto {}
import { PageDto } from 'src/base/dto/page.dto';

export class PageRoleDto extends PageDto {
  name: string;
  phone: string;
  email: string;
}
