import re
import json


def parse_netlog(file, match_id, user_id):
    regex = re.compile("\d\d\d\d-\d\d-\d\dT\d\d-\d\d-\d\d")

    windows = []
    incoming = [0]
    outgoing = [0]
    time = [0]

    filetext = file.read()
    filetext = filetext.decode('UTF-8')

    try:
        for line in filetext.splitlines():
            if regex.match(line):
                continue

            tokens = line.split(',')

            time.append(int(tokens[0]))
            incoming.append(int(tokens[2]))
            outgoing.append(int(tokens[3]))

            time_window = int(tokens[0])
            ping_window = int(tokens[8])
            jitter_window = int(tokens[16])

            try:
                loss_percentage_window = float(tokens[15])
            except ValueError:
                # fill in zero for -nan(ind) error in netlog
                loss_percentage_window = float(0)

            in_bandwidth_window = (incoming[-1] - incoming[-2]) / ((time[-1] - time[-2]))
            out_bandwidth_window = (outgoing[-1] - outgoing[-2]) / ((time[-1] - time[-2]))

            windows.append({
                'match_id': match_id,
                'user_id': user_id,
                'time': time_window,
                'ping': ping_window,
                'jitter': jitter_window,
                'in_bandwidth': in_bandwidth_window,
                'out_bandwidth': out_bandwidth_window,
                'loss': loss_percentage_window})
    except Exception as ex:
        print('2' + str(ex))

    return windows


def parse_match(match, user_id):

    teams = {
        'winner': [],
        'loser': [],
    }
    try:
        for participant in match.participants:
            participant_to_save = {
                'name': participant.summoner.name,
                'profile_icon_id': participant.summoner.profile_icon.id,
                'id': participant.id,
                'champion': participant.champion.id,
                'role': participant.role.value if participant.role is not None else '',
                'lane': participant.lane.value if participant.lane is not None else '',
                'kills': participant.stats.kills,
                'deaths': participant.stats.deaths,
                'assists': participant.stats.assists,
                'total_dmg': participant.stats.total_damage_dealt,
                'total_damage_taken': participant.stats.total_damage_taken,
                'gold_earned': participant.stats.gold_earned,
            }
            if participant.team.win:
                teams['winner'].append(participant_to_save)
            else:
                teams['loser'].append(participant_to_save)

        match_to_save = {
            'user_id': user_id,
            'match_id': match.id,
            'queue_id': match.queue.value if match.queue is not None else '',
            'game_type': match.type.value if match.type is not None else '',
            'game_duration': int(match.duration.total_seconds() * 1000),
            'game_start': match.creation.timestamp,
            'platform_id': match.platform.value if match.platform is not None else '',
            'season_id': match.season.value if match.season is not None else '',
            'map_id': match.map.id,
            'game_mode': match.mode.value if match.mode is not None else '',
            'teams': json.dumps(teams)
        }
        return match_to_save

    except Exception as ex:
        print('1' + str(ex))
        return False


def parse_event(event, pov_id, match_id, events, user_id):
    if event.type == 'CHAMPION_KILL':
        if (event.killer_id == pov_id or event.victim_id == pov_id):
            type = 'CHAMPION_KILL' if event.killer_id == pov_id else 'CHAMPION_DEATH'
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": int(event.position.x),
                "y": int(event.position.y),
                "active_participant": event.killer_id,
                "passive_participant": event.victim_id,
                "assisting_participants": event.assisting_participants,
                "type": type,
            })
    elif event.type == 'WARD_PLACED':
        if (event.creator_id == pov_id):
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.creator_id,
                "passive_participant": '',
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'WARD_KILL':
        if (event.killer_id == pov_id):
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.killer_id,
                "passive_participant": '',
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'BUILDING_KILL':
        if (event.killer_id == pov_id):
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": int(event.position.x),
                "y": int(event.position.y),
                "active_participant": event.killer_id,
                "passive_participant": event.building_type,
                "assisting_participants": event.assisting_participants,
                "type": event.type,
            })
    elif event.type == 'ELITE_MONSTER_KILL':
        if (event.killer_id == pov_id):
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": int(event.position.x),
                "y": int(event.position.y),
                "active_participant": event.killer_id,
                "passive_participant": event.monster_sub_type,
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'ITEM_PURCHASED':
        if event.participant_id == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": event.item_id,
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'ITEM_SOLD':
        if event.participant_id == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": event.item_id,
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'ITEM_DESTROYED':
        if event.participant_id == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": event.item_id,
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'ITEM_UNDO':
        if event.participant_id == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": '',
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'SKILL_LEVEL_UP':
        if event.participant_id == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": '',
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'ASCENDED_EVENT':
        if event.participantId == pov_id or event.killerId == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": '',
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'CAPTURE_POINT':
        if event.participantId == pov_id or event.killerId == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": '',
                "assisting_participants": [],
                "type": event.type,
            })
    elif event.type == 'PORO_KING_SUMMON':
        if event.participantId == pov_id or event.killerId == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": int(event.timestamp.total_seconds() * 1000),
                "x": 0,
                "y": 0,
                "active_participant": event.participant_id,
                "passive_participant": '',
                "assisting_participants": [],
                "type": event.type,
            })


def parse_timeline(timeline, log_owner_id, match_id, user_id):
    events = []
    frames = []

    try:
        for frame in timeline.frames:
            owner_frame = frame.participant_frames[log_owner_id]
            frames.append({
                'user_id': user_id,
                'match_id': match_id,
                'timestamp': int(frame.timestamp.total_seconds() * 1000),
                'exp': owner_frame.experience,
                'gold': owner_frame.gold_earned,
                'creep_score': owner_frame.creep_score,
                'neutral_score': owner_frame.neutral_minions_killed,
                'level': owner_frame.level,
            })

            for event in frame.events:
                parse_event(event, log_owner_id, match_id, events, user_id)
    except Exception as ex:
        print('3' + str(ex))

    return frames, events
