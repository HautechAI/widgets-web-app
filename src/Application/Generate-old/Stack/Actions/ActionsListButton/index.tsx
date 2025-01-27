import { MenuItem, Typography } from '@mui/material';
import useLogic from './logic';
import S from './style';
import type { Props } from './types';
import { MaterialSymbol } from 'react-material-symbols';

const ActionsListButton = (props: Props) => {
    const { anchor, menuOpen, onClickAction, onCloseMenu, onOpenMenu } = useLogic(props);
    return (
        <S.Container>
            <S.Button disabled={props.disabled} onClick={onOpenMenu} variant="outlined">
                <MaterialSymbol icon={props.icon as any} size={24} />
                <Typography variant="body2">{props.name}</Typography>
            </S.Button>
            <S.Menu anchorEl={anchor} open={menuOpen} onClose={onCloseMenu}>
                {props.actions.map((action) => (
                    <MenuItem disabled={props.disabled} onClick={() => onClickAction(action)} key={action.name}>
                        {action.name}
                    </MenuItem>
                ))}
            </S.Menu>
        </S.Container>
    );
};

export default ActionsListButton;
