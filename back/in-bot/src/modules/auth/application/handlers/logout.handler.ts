import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../commands/logout.command';
import { TOKEN_REPOSITORY } from '../contracts/tokens';
import type { ITokenRepository } from '../contracts/token-repository.contract';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(command: LogoutCommand) {
    await this.tokenRepository.revoke(command.jwtToken);
  }
}
