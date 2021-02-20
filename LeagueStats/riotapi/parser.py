import re
import json


def parse_netlog(file):
    regex = re.compile('\d\d\d\d-\d\d-\d\dT\d\d-\d\d-\d\d')

    time = [0]
    incoming = [0]
    outgoing = [0]
    ping = [0]

    # Information per window
    loss_percentage_window = [0]
    jitter_window = [0]

    # Computed values
    out_bandwidth = [0]
    in_bandwidth = [0]

    filetext = file.read()
    filetext = filetext.decode('UTF-8')

    for line in filetext.splitlines():
        if regex.match(line):
            continue

        tokens = line.split(',')
        # try:
        time.append(int(tokens[0]))
        incoming.append(int(tokens[2]))
        outgoing.append(int(tokens[3]))
        ping.append(int(tokens[8]))

        try:
            loss_percentage_window.append(float(tokens[15]))
        except ValueError as e:
            # fill in zero for -nan(ind) error in netlog
            loss_percentage_window.append(float(0))

        jitter_window.append(int(tokens[16]))

        in_bandwidth.append((8.0 * (incoming[-1] - incoming[-2])) / (time[-1] - time[-2]))
        out_bandwidth.append((8.0 * (outgoing[-1] - outgoing[-2])) / (time[-1] - time[-2]))

    return {'time': time, 'ping': ping, 'jitter': jitter_window, 'in_bandwidth': in_bandwidth,
            'out_bandwidth': out_bandwidth, 'loss': loss_percentage_window}


def parse_event(event, pov_id, events):
    if event.type == 'CHAMPION_KILL':
        evjson = {
            "timestamp": event.timestamp,
            "position": {
                "x": event.position.x,
                "y": event.position.x
            },
            "killerId": event.killer_id,
            "victimId": event.victim_id,
            "assistingParticipantIds": event.assisting_participants,
        }
        if (event.killerId == pov_id):
            return (evjson, 'PLAYER_CHAMPION_KILL')
        elif (event.victimId == pov_id):
            return (evjson, 'PLAYER_CHAMPION_DEATH')
        else:
            return (evjson, 'CHAMPION_KILL')
    elif event.type == 'WARD_PLACED':
        evjson = {
            "timestamp": event.timestamp,
            "creatorId": event.creator_id,
        }
        return (evjson, 'WARD_PLACED')
    elif event.type == 'WARD_KILL':
        evjson = {
            "timestamp": event.timestamp,
            "killerId": event.killer_id,
        }
        return (evjson, 'WARD_KILL')
    elif event.type == 'BUILDING_KILL':
        evjson = {
            "timestamp": event.timestamp,
            "position": {
                "x": event.position.x,
                "y": event.position.x
            },
            "killerId": event.killer_id,
            "assistingParticipantIds": event.assisting_participants,
            "towerType": event.tower_type,
        }
        if event.killerId == pov_id:
            return (evjson, 'PLAYER_BUILDING_KILL')
        else:
            return (evjson, 'BUILDING_KILL')
    elif event.type == 'ELITE_MONSTER_KILL':
        evjson = {
            "timestamp": event.timestamp,
            "position": {
                "x": event.position.x,
                "y": event.position.x
            },
            "killerId": event.killer_id,
        }
        if event.killerId == pov_id:
            return (evjson, 'PLAYER_ELITE_MONSTER_KILL')
        else:
            return (evjson, 'ELITE_MONSTER_KILL')
    elif event.type == 'ITEM_PURCHASED':
        evjson = {
            "timestamp": event.timestamp,
        }
        if event.participantId == pov_id:
            return (evjson, 'PLAYER_ITEM_PURCHASED')
        else:
            return (evjson, 'ITEM_PURCHASED')
    elif event.type == 'ITEM_SOLD':
        evjson = {
            "timestamp": event.timestamp,
        }
        if event.participantId == pov_id:
            return (evjson, 'PLAYER_ITEM_SOLD')
        else:
            return (evjson, 'ITEM_SOLD')
    elif event.type == 'ITEM_DESTROYED':
        evjson = {
            "timestamp": event.timestamp,
        }
        if event.participantId == pov_id:
            return (evjson, 'PLAYER_ITEM_DESTROYED')
        else:
            return (evjson, 'ITEM_DESTROYED')
    elif event.type == 'ITEM_UNDO':
        evjson = {
            "timestamp": event.timestamp,
        }
        if event.participantId == pov_id:
            return (evjson, 'PLAYER_ITEM_UNDO')
        else:
            return (evjson, 'ITEM_UNDO')
    elif event.type == 'SKILL_LEVEL_UP':
        evjson = {
            "timestamp": event.timestamp,
        }
        if event.participantId == pov_id:
            return (evjson, 'PLAYER_SKILL_LEVEL_UP')
        else:
            return (evjson, 'SKILL_LEVEL_UP')
    elif event.type == 'ASCENDED_EVENT':
        evjson = {
            "timestamp": event.timestamp,
        }
        if event.participantId == pov_id or event.killerId == pov_id:
            return (evjson, 'PLAYER_ASCENDED_EVENT')
        else:
            return (evjson, 'ASCENDED_EVENT')
    elif event.type == 'CAPTURE_POINT':
        evjson = {
            "timestamp": event.timestamp,
        }
        if event.participantId == pov_id or event.killerId == pov_id:
            return (evjson, 'PLAYER_CAPTURE_POINT')
        else:
            return (evjson, 'CAPTURE_POINT')
    elif event.type == 'PORO_KING_SUMMON':
        evjson = {
            "timestamp": event.timestamp,
        }

        if event.participantId == pov_id or event.killerId == pov_id:
            return (evjson, 'PLAYER_PORO_KING_SUMMON')
        else:
            return (evjson, 'PORO_KING_SUMMON')


def get_base_ingame_stats(timeline, log_owner_id):
    exp = []
    gold = []
    farm = []
    player_frames = []
    timestamps = []
    events = []

    for frame in timeline.frames:
        owner_frame = frame.participant_frames[log_owner_id]

        timestamps.append(1.0 / (1000 * 60) * frame.timestamp)
        player_frames.append(owner_frame)

        gold.append(owner_frame.gold_earned)
        exp.append(owner_frame.experience)
        farm.append(owner_frame.creep_score + owner_frame.neutral_minions_killed)

        for event in frame.events:
            (evjson, eventclass) = parse_event(event, log_owner_id, events)
            events.get(eventclass).append(evjson)

    return timestamps, exp, gold, farm, events
